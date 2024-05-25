import Nav from '../private/Nav'
import { NavLink } from 'react-router-dom'
export const Header = () => {
  return (
    <header className="layout__navbar">

            <header className="navbar__header">
                <NavLink to="/social" className="navbar__title">
                  <span>Ideas_Entrelazadas</span>
                  </NavLink>
                
            </header>
            <Nav />
        </header>
  )
}

export default Header
