/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Global from "../../helpers/Global";
import avatar from "../../assets/img/user.png";
import useAuth from '../../hooks/useAuth';
import ReactTimeAgo from 'react-time-ago';
import Swal from 'sweetalert2';

export const PublicationList = ({ publications, page, setPage, more, setMore, getPublications }) => {
    const { auth } = useAuth();

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getPublications(next);
    };

    const deletePublication = async (publicationId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo!',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'large-swal-popup',
                title: 'large-swal-title',
                content: 'large-swal-content'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${Global.url}publication/remove/${publicationId}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": localStorage.getItem("token")
                        }
                    });
                    const data = await response.json();
                    if (data.status === "success") {
                        Swal.fire({
                            title: 'Eliminado!',
                            text: 'La publicación ha sido eliminada.',
                            icon: 'success',
                            customClass: {
                                popup: 'large-swal-popup',
                                title: 'large-swal-title',
                                content: 'large-swal-content'
                            }
                        });
                        // Refrescar la lista de publicaciones
                        setPage(1); // Asegurarse de que la página se reinicia
                        getPublications(1, true); // Llamar a getPublications para refrescar
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'Hubo un problema al eliminar la publicación.',
                            icon: 'error',
                            customClass: {
                                popup: 'large-swal-popup',
                                title: 'large-swal-title',
                                content: 'large-swal-content'
                            }
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Hubo un problema al eliminar la publicación.',
                        icon: 'error',
                        customClass: {
                            popup: 'large-swal-popup',
                            title: 'large-swal-title',
                            content: 'large-swal-content'
                        }
                    });
                }
            }
        });
    };

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
            <div className="content__posts">
                {publications.map(publication => (
                    <article className="posts__post" key={publication._id}>
                        <div className="post__container">
                            <div className="post__image-user">
                                <Link to={`/social/perfil/${publication.user._id}`} className="post__image-link">
                                    {publication.user.image !== "default.png" ? (
                                        <img src={`${Global.url}user/avatar/${publication.user.image}`} className="post__user-image" alt="Foto de perfil" />
                                    ) : (
                                        <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                                    )}
                                </Link>
                            </div>
                            <div className="post__body">
                                <div className="post__user-info">
                                    <Link to={`/social/perfil/${publication.user._id}`} className="user-info__name">
                                        {publication.user.name} {publication.user.surname}
                                    </Link>
                                    <span className="user-info__divider"> | </span>
                                    <a href="#" className="user-info__create-date">
                                        <ReactTimeAgo date={publication.created_at} locale="es-Es" />
                                    </a>
                                </div>
                                <h4 className="post__content">{publication.text}</h4>
                                {publication.file && <img src={`${Global.url}publication/media/${publication.file}`} alt="Contenido" />}
                            </div>
                        </div>
                        {(auth._id === publication.user._id || auth.role === 'role_admin') && (
                            <div className="post__buttons">
                                <button onClick={() => deletePublication(publication._id)} className="post__button">
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        )}
                    </article>
                ))}
            </div>
            {more && (
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver más publicaciones
                    </button>
                </div>
            )}
        </>
    );
};
