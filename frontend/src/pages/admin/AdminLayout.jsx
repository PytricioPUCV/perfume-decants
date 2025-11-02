import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Panel Admin</h2>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/admin/productos" className={({ isActive }) => isActive ? 'active' : ''}>
            📦 Productos
          </NavLink>
          <NavLink to="/admin/pedidos" className={({ isActive }) => isActive ? 'active' : ''}>
            🛍️ Pedidos
          </NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
