import { useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { Global } from '../../../helpers/Global';
import { useNavigate } from 'react-router-dom';
//TODO hacer un navigate para que despues del registro se redireccione al login
export const UserForm = () => {
    const navigate = useNavigate();
    const { form, changed } = useForm({role: 'role_user'});
    const [status, setStatus] = useState({
        saved: false,
        message: ''
    });

    const saveUser = async (e) => {
        e.preventDefault();

        // Validación de campos requeridos
        const requiredFields = ['name', 'surname', 'nick', 'email', 'password', 'role'];
        for (let field of requiredFields) {
            if (!form[field]) {
                setStatus({
                    saved: false,
                    message: `El campo ${field} es obligatorio.`
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
            } else {
                setStatus({ saved: false, message: data.message || 'Error al registrar el usuario' });
            }
        } catch (error) {
            setStatus({ saved: false, message: 'Error de conexión con el servidor' });
        }
        navigate('/admin/usuarios')
    };

    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Agregar Nuevo Usuario</h1>
            </header>
            <div className="content__posts">
                <strong className={`alert ${status.saved ? 'alert-success' : 'alert-danger'}`}>
                    {status.message}
                </strong>
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
                    <div className="form-group">
                        <label htmlFor="role">Rol</label>
                        <select name="role" onChange={changed} value={form.role}>
                            <option value="role_user">Usuario</option>
                            <option value="role_admin">Administrador</option>
                        </select>
                    </div>
                    <input type="submit" value="Regístrate" className="btn btn-success" />
                </form>
            </div>
        </>
    );
};