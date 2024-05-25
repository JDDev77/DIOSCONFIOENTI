const fs = require("fs");
const path = require("path");
const Publication = require("../models/publication");
const followService = require("../services/followService");

// Acciones de prueba
const pruebaPublication = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/publication.js"
    });
}

// Guardar publicacion
const save = (req, res) => {

    const params = req.body;
    if (!params.text) return res.status(400).send({ status: "error", "message": "Debes enviar el texto de la publicacion." });

    // Crear y rellenar el objeto del modelo
    let newPublication = new Publication(params);
    newPublication.user = req.user.id;

    // Guardar objeto en bbdd
    newPublication.save((error, publicationStored) => {

        if (error || !publicationStored) return res.status(400).send({ status: "error", "message": "No se ha guardado la publicación." });

        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            message: "Publicación guardada",
            publicationStored
        });
    });
}

// Sacar una publicacion
const detail = (req, res) => {
    const publicationId = req.params.id;
    Publication.findById(publicationId, (error, publicationStored) => {

        if (error || !publicationStored) {
            return res.status(404).send({
                status: "error",
                message: "No existe la publicacion"
            })
        }

        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            message: "Mostrar publicacion",
            publication: publicationStored
        });
    });
}

// Eliminar publicaciones
const remove = (req, res) => {
    const publicationId = req.params.id;
    // Buscar la publicación por ID para verificar quién es el usuario autor
    Publication.findById(publicationId, (error, publication) => {
        if (error) {
            return res.status(500).send({
                status: "error",
                message: "Error al buscar la publicación"
            });
        }

        // Si no se encuentra la publicación
        if (!publication) {
            return res.status(404).send({
                status: "error",
                message: "No se ha encontrado la publicación"
            });
        }

        // Verificar si el usuario es el autor de la publicación o un administrador
        if (publication.user.toString() === req.user.id || req.user.role === 'role_admin') {
            // Proceder a eliminar la publicación
            publication.remove(error => {
                if (error) {
                    return res.status(500).send({
                        status: "error",
                        message: "No se ha eliminado la publicación"
                    });
                }

                // Devolver respuesta de éxito
                return res.status(200).send({
                    status: "success",
                    message: "Publicación eliminada correctamente",
                    publicationId: publicationId
                });
            });
        } else {
            // Si el usuario no tiene permisos para eliminar la publicación
            return res.status(403).send({
                status: "error",
                message: "No tienes permiso para eliminar esta publicación"
            });
        }
    });
}

/*const remove = (req, res) => {
    
    const publicationId = req.params.id;
    Publication.find({ "user": req.user.id, "_id": publicationId }).remove(error => {
        if (error) {
            return res.status(500).send({
                status: "error",
                message: "No se ha eliminado la publicacion"
            });
        }

        // Devolver respuesta
        return res.status(200).send({
            status: "success",
            message: "Eliminar publicacion",
            publication: publicationId
        });
    });

}
*/
// listar publicaciones de un usuario
const user = (req, res) => {
    
    const userId = req.params.id;
    let page = 1;

    if (req.params.page) page = req.params.page

    const itemsPerPage = 5;

    // Find, populate, ordenar, paginar
    Publication.find({ "user": userId })
        .sort("-created_at")
        .populate('user', '-password -__v -role -email')
        .paginate(page, itemsPerPage, (error, publications, total) => {

            if (error || !publications || publications.length <= 0) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay publicaciones para mostrar"
                });
            }

            // Devolver respuesta
            return res.status(200).send({
                status: "success",
                message: "Publicaciones del perfil de un usuario",
                page,
                total,
                pages: Math.ceil(total / itemsPerPage),
                publications,

            });
        });
}

// Subir ficheros
const upload = (req, res) => {
   
    const publicationId = req.params.id;
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "Petición no incluye la imagen"
        });
    }

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacar la extension del archivo
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];

    // Comprobar extension
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {

        
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);
        return res.status(400).send({
            status: "error",
            message: "Extensión del fichero invalida"
        });
    }

    // Si si es correcta, guardar imagen en bbdd
    Publication.findOneAndUpdate({ "user": req.user.id, "_id": publicationId }, { file: req.file.filename }, { new: true }, (error, publicationUpdated) => {
        if (error || !publicationUpdated) {
            return res.status(500).send({
                status: "error",
                message: "Error en la subida del avatar"
            })
        }
        return res.status(200).send({
            status: "success",
            publication: publicationUpdated,
            file: req.file,
        });
    });

}

// Devolver archivos multimedia imagenes
const media = (req, res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/publications/" + file;

    // Comprobar que existe
    fs.stat(filePath, (error, exists) => {

        if (!exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            });
        }

        // Devolver un file
        return res.sendFile(path.resolve(filePath));
    });

}

// Listar todas las publicaciones (FEED)
const feed = async (req, res) => {
    // Sacar la pagina actual
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
    }

    // Establecer numero de elementos por pagina
    let itemsPerPage = 5;

    // Sacar un array de identificadores de usuarios que yo sigo como usuario logueado
    try {
        const myFollows = await followService.followUserIds(req.user.id);

        // Find a publicaciones in, ordenar, popular, paginar
        const publications = Publication.find({ user: myFollows.following })
            .populate("user", "-password -role -__v -email")
            .sort("-created_at")
            .paginate(page, itemsPerPage, (error, publications, total) => {

                if(error || !publications){
                    return res.status(500).send({
                        status: "error",
                        message: "No hay publicaciones para mostrar",
                    });
                }

                return res.status(200).send({
                    status: "success",
                    message: "Feed de publicaciones",
                    following: myFollows.following,
                    total,
                    page,
                    pages: Math.ceil(total / itemsPerPage),
                    publications
                });
            });

    } catch (error) {

        return res.status(500).send({
            status: "error",
            message: "Error al obtener usuarios que sigues",
        });
    }

}

// Exportar acciones
module.exports = {
    pruebaPublication,
    save,
    detail,
    remove,
    user,
    upload,
    media,
    feed
}