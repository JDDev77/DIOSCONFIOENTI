/* eslint-disable react/prop-types */
import useAuth from "../../hooks/useAuth";
import avatar from "../../assets/img/user.png";
import Global from "../../helpers/Global";
import { Link } from "react-router-dom";
import ReactTimeAgo from 'react-time-ago';
import { useState } from 'react';
import Swal from 'sweetalert2';

export const UserList = ({ users, getUsers, following, setFollowing }) => {
    const { auth } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const follow = async (userId) => {
        const request = await fetch(Global.url + 'follow/save', {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();
        if (data.status === "success") {
            setFollowing([...following, userId]);
        }
    };

    const unfollow = async (userId) => {
        const request = await fetch(Global.url + 'follow/unfollow/' + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();
        if (data.status === "success") {
            let filterFollowings = following.filter(followingUserId => userId !== followingUserId);
            setFollowing(filterFollowings);
        }
    };

    const deleteUser = async (userId) => {
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
                const request = await fetch(`${Global.url}user/delete/${userId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("token")
                    }
                });
                const data = await request.json();
                if (data.status === "success") {
                    Swal.fire({
                        title: 'Eliminado!',
                        text: 'El usuario ha sido eliminado.',
                        icon: 'success',
                        customClass: {
                            popup: 'large-swal-popup',
                            title: 'large-swal-title',
                            content: 'large-swal-content'
                        }
                    });
                    getUsers();
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Hubo un problema al eliminar el usuario.',
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

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.surname.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
                />

                {filteredUsers.map(user => (
                    <article className="posts__post" key={user._id}>
                        <div className="post__container">
                            <div className="post__image-user">
                                <Link to={`/social/perfil/${user._id}`} className="post__image-link">
                                    {user.image !== "default.png" ? (
                                        <img src={`${Global.url}user/avatar/${user.image}`} className="post__user-image" alt="Foto de perfil" />
                                    ) : (
                                        <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                                    )}
                                </Link>
                            </div>
                            <div className="post__body">
                                <div className="post__user-info">
                                    <Link to={`/social/perfil/${user._id}`} className="user-info__name">
                                        {user.name} {user.surname}
                                    </Link>
                                    <span className="user-info__divider"> | </span>
                                    <Link to={`/social/perfil/${user._id}`} className="user-info__create-date">
                                        <ReactTimeAgo date={user.created_at} locale="es-Es" />
                                    </Link>
                                </div>
                                <h4 className="post__content">{user.bio}</h4>
                            </div>
                        </div>
                        
                        {user._id !== auth._id && (
                            <div className="post__buttons">
                                {!following.includes(user._id) ? (
                                    <a href="#" className="post__button post__button--green" onClick={() => follow(user._id)}>
                                        Seguir
                                    </a>
                                ) : (
                                    <a href="#" className="post__button post__button" onClick={() => unfollow(user._id)}>
                                        Dejar de seguir
                                    </a>
                                )}
                                <br />
                                {auth.role === "role_admin" && (
                                    <>
                                        <Link to={`/admin/usuarios/actualizar/${user._id}`} className="post__button post__button--blue">Actualizar</Link>
                                        <Link to={`/admin/usuarios/detalle/${user._id}`} className="post__button post__button--blue">Detalles</Link>
                                        <button onClick={() => deleteUser(user._id)} className="post__button post__button--red">Eliminar</button>
                                    </>
                                )}
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </>
    );
};
