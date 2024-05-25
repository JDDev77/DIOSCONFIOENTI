import { useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { Global } from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Register = () => {
    const navigate = useNavigate();
    const { form, changed } = useForm({});
    const [status, setStatus] = useState({
        saved: false,
        message: ''
    });

    const saveUser = async (e) => {
        e.preventDefault();

        // Validación de campos requeridos
        const requiredFields = ['name', 'surname', 'nick', 'email', 'password'];
        for (let field of requiredFields) {
            if (!form[field]) {
                Swal.fire({
                    title: 'Error!',
                    text: `El campo ${field} es obligatorio.`,
                    icon: 'error',
                    customClass: {
                        popup: 'large-swal-popup',
                        title: 'large-swal-title',
                        content: 'large-swal-content'
                    }
                });
                return;
            }
        }

        // Envío de datos al servidor
        try {
            const response = await fetch(`${Global.url}user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await response.json();
            if (data.status === 'success') {
                setStatus({ saved: true, message: 'Usuario registrado correctamente' });
                Swal.fire({
                    title: 'Registrado!',
                    text: 'Usuario registrado correctamente.',
                    icon: 'success',
                    customClass: {
                        popup: 'large-swal-popup',
                        title: 'large-swal-title',
                        content: 'large-swal-content'
                    }
                }).then(() => {
                    navigate('/login');
                });
            } else {
                setStatus({ saved: false, message: data.message || 'Error al registrar el usuario' });
                Swal.fire({
                    title: 'Error!',
                    text: data.message || 'Error al registrar el usuario.',
                    icon: 'error',
                    customClass: {
                        popup: 'large-swal-popup',
                        title: 'large-swal-title',
                        content: 'large-swal-content'
                    }
                });
            }
        } catch (error) {
            setStatus({ saved: false, message: 'Error de conexión con el servidor' });
            Swal.fire({
                title: 'Error!',
                text: 'Error de conexión con el servidor.',
                icon: 'error',
                customClass: {
                    popup: 'large-swal-popup',
                    title: 'large-swal-title',
                    content: 'large-swal-content'
                }
            });
        }
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
            <header className="content__header content__header--public">
                <h1 className="content__title">Registro</h1>
            </header>
            <div className="content__posts">
                <form className="register-form" onSubmit={saveUser}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name="name" onChange={changed} value={form.name || ''} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="surname">Apellido</label>
                        <input type="text" name="surname" onChange={changed} value={form.surname || ''} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bio">Biografía</label>
                        <textarea name="bio" onChange={changed} value={form.bio || ''} rows="4"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nick">Mote</label>
                        <input type="text" name="nick" onChange={changed} value={form.nick || ''} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input type="email" name="email" onChange={changed} value={form.email || ''} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" name="password" onChange={changed} value={form.password || ''} />
                    </div>
                    <input type="submit" value="Regístrate" className="btn btn-success" />
                </form>
            </div>
        </>
    );
};
