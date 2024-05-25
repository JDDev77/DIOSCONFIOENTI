import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import { Global } from '../../../helpers/Global';
import avatar  from '../../../assets/img/user.png';

export const UserUpdate = () => {
  const { userId } = useParams(); // ID del usuario desde la URL
  const navigate = useNavigate();
  console.log(userId)
  const { form, changed, setForm } = useForm({
    name: '',
    surname: '',
    nick: '',
    email: '',
    password: '',
    bio: '',
    role: 'role_user', // Inicializar con un rol por defecto
    avatar: avatar 
  });

  const [status, setStatus] = useState({ saved: false, message: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${Global.url}user/profile/${userId}`, {
        method: 'GET',
        headers: { 
          "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token") 
        }
      });
      const data = await response.json();
      console.log(data)
      if (data.status === 'success') {
        setForm(data.user);
      } else {
        setStatus({ saved: false, message: data.message || 'No se pudo cargar la información del usuario.' });
      }
    };
    fetchUser();
  }, [userId, setForm]);

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${Global.url}user/update/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 
        'Authorization': localStorage.getItem("token")
       },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      console.log(data)
      if (data.status === 'success') {
        setStatus({ saved: true, message: 'Usuario actualizado correctamente' });
        navigate('/admin/usuarios'); // Redirigir al listado de usuarios
      } else {
        setStatus({ saved: false, message: data.message || 'Error al actualizar el usuario' });
      }
    } catch (error) {
      setStatus({ saved: false, message: 'Error de conexión con el servidor' });
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Actualizar Usuario </h1>
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
            <label htmlFor="nick">Nickname</label>
            <input type="text" name="nick" onChange={changed} value={form.nick || ''} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" name="email" onChange={changed} value={form.email || ''} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña (dejar en blanco para no cambiar)</label>
            <input type="password" name="password" onChange={changed} value={form.password || ''} />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Biografía</label>
            <textarea name="bio" onChange={changed} value={form.bio || ''} rows="4"></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="role">Rol</label>
            <select name="role" onChange={changed} value={form.role}>
              <option value="role_user">Usuario</option>
              <option value="role_admin">Administrador</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="avatar">Avatar URL</label>
            <input type="text" name="avatar" onChange={changed} value={form.avatar || ''} />
          </div>
          <input type="submit" value="Actualizar" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};
