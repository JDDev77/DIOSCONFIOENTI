import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { SerializeForm } from "../../helpers/SerializeForm";
import { Global } from "../../helpers/Global";
import Swal from 'sweetalert2';

export const Config = () => {
    const [saved, setSaved] = useState("not_saved");
    const { auth, setAuth } = useAuth();

    const updateUser = async (e) => {
        e.preventDefault();
        // Token de autenticacion
        const token = localStorage.getItem("token");

        // Recoger datos de formulario
        let newDataUser = SerializeForm(e.target);
        // Borrar propiedad innecesaria
        delete newDataUser.file0;

        // Actualizar usuario
        const request = await fetch(Global.url + "user/update", {
            method: "PUT",
            body: JSON.stringify(newDataUser),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await request.json();

        if (data.status === "success") {
            delete data.user.password;
            setAuth(data.user);
            setSaved("saved");
            Swal.fire({
                title: 'Perfil actualizado!',
                text: 'Tu perfil ha sido actualizado con éxito.',
                icon: 'success',
                customClass: {
                    popup: 'large-swal-popup',
                    title: 'large-swal-title',
                    content: 'large-swal-content'
                }
            });
        } else {
            setSaved("error");
            Swal.fire({
                title: 'Error!',
                text: 'Hubo un problema al actualizar tu perfil.',
                icon: 'error',
                customClass: {
                    popup: 'large-swal-popup',
                    title: 'large-swal-title',
                    content: 'large-swal-content'
                }
            });
        }

        // Subida de imagenes
        const fileInput = document.querySelector("#file");

        if (data.status === "success" && fileInput.files[0]) {
            // Recoger imagen a subir
            const formData = new FormData();
            formData.append('file0', fileInput.files[0]);

            // Petición para enviar el fichero
            const uploadRequest = await fetch(Global.url + "user/upload", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": token
                }
            });

            const uploadData = await uploadRequest.json();

            if (uploadData.status === "success") {
                delete uploadData.user.password;
                setAuth(uploadData.user);
                setSaved("saved");
                Swal.fire({
                    title: 'Perfil actualizado!',
                    text: 'Tu perfil ha sido actualizado con éxito.',
                    icon: 'success',
                    customClass: {
                        popup: 'large-swal-popup',
                        title: 'large-swal-title',
                        content: 'large-swal-content'
                    }
                });
            } else {
                setSaved("error");
                Swal.fire({
                    title: 'Error!',
                    text: 'Hubo un problema al actualizar tu perfil.',
                    icon: 'error',
                    customClass: {
                        popup: 'large-swal-popup',
                        title: 'large-swal-title',
                        content: 'large-swal-content'
                    }
                });
            }
        }
    }

    return (
        <>
            <style>
                {`
                    .large-swal-popup {
                        width: 600px !important; /* Ajusta el tamaño a tu preferencia */
                        font-size: 1.2em; /* Ajusta el tamaño de la fuente a tu preferencia */
                    }

                    .large-swal-title {
                        font-size: 2em !important; /* Ajusta el tamaño del título a tu preferencia */
                    }

                    .large-swal-content {
                        font-size: 1.2em !important; /* Ajusta el tamaño del contenido a tu preferencia */
                    }
                `}
            </style>
            <header className="content__header content__header--public">
                <h1 className="content__title">Registro</h1>
            </header>
            <h1></h1>
            <div className="content__posts">
                <form className="config-form" onSubmit={updateUser}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name="name" defaultValue={auth.name} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname">Apellido</label>
                        <input type="text" name="surname" defaultValue={auth.surname} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nick">Mote</label>
                        <input type="text" name="nick" defaultValue={auth.nick} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Biografía</label>
                        <textarea name="bio" defaultValue={auth.bio} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input type="email" name="email" defaultValue={auth.email} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name="password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="file0">Avatar</label>
                        <div className="avatar" defaultValue={auth.name}></div>
                        <input type="file" name="file0" id="file" />
                    </div>
                    <br />
                    <input type="submit" value="Actualizar" className="btn btn-success" />
                </form>
            </div>
        </>
    )
}
