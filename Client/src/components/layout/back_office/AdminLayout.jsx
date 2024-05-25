
import { Navigate, Outlet } from 'react-router-dom';
import { SideBar } from '../private/SideBar';
import Header from './Header';

import useAuth from '../../../hooks/useAuth';

export const AdminLayout = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  return (
    <>
      {auth.role === 'role_admin' ? (
        <>
          <Header />
          <section className="layout__content">
            <Outlet />
          </section>
          <SideBar />
        </>
      ) : (
        <Navigate to="/social" replace />
      )}
    </>
  );
}

export default AdminLayout;
