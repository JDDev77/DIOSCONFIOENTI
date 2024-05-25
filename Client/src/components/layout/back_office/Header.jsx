import Nav from './Nav';
import { NavLink } from 'react-router-dom';
export const AdminHeader = () => {
    return (
        <header className="layout__navbar admin">
            <NavLink to="/social" className="navbar__title">
                  <span>Ideas_Entrelazadas</span>
                  </NavLink>
                
            <Nav />
        </header>
    );
}

export default AdminHeader;
