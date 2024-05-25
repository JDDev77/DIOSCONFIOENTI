import { NavLink } from "react-router-dom";
import useAuth from '../../../hooks/useAuth';
import avatar from '../../../assets/img/user.png';
import Global from '../../../helpers/Global';


export const AdminNav = () => {
    
    const{auth} = useAuth()
    console.log(auth)
    return (
        <nav className="navbar__container-lists admin">
            <ul className="container-lists__menu-list">
                <li className="menu-list__item">
                    <NavLink to="/admin/usuarios" className="menu-list__link">
                        <i className="fa-solid fa-users"></i>
                        <span className="menu-list__title">Usuarios</span>
                    </NavLink>
                </li>
            </ul>
            
            <ul className="container-lists__list-end">
                    <li className="list-end__item">
                        <NavLink to={"/social/perfil/" + auth._id} className="list-end__link-image">
                        {auth.image != "default.png" && <img src={Global.url + "user/avatar/" + auth.image} className="list-end__img" alt="Foto de perfil"/>}
                        {auth.image == "default.png" && <img src={avatar} className="list-end__img" alt="Foto de perfil"/>}
                        </NavLink>
                    </li>
                    <li className="list-end__item">
                        <NavLink to={"/social/perfil/" + auth._id} className="list-end__link">
                            <span className="list-end__name">{auth.nick}</span>
                            
                        </NavLink>
                    </li>
                    <li className="list-end__item">
                        <NavLink to="/social/ajustes" className="list-end__link">
                            <i className = 'fa-solid fa-gear'></i>
                            <span className="list-end__name">Editar Perfil</span>
                            
                        </NavLink>
                    </li>
                    <li className="list-end__item">
                        <NavLink to="/social/logout" className="list-end__link">
                            <i className = 'fa-solid fa-arrow-right-from-bracket'></i>
                            <span className="list-end__name">Cerrar Sesion</span>
                            
                        </NavLink>
                    </li>
                    </ul>
        </nav>
    );
}

export default AdminNav;
