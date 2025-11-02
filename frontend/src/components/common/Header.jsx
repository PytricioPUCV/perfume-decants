import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/logo.png'; // Importar el logo
import './Header.css';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo con imagen */}
          <Link to="/" className="logo">
            <img src={logo} alt="Decants del Puerto" className="logo-image" />
            <span className="logo-text">Decants del Puerto</span>
          </Link>

          {/* Navegación */}
          <nav className="nav">
            <Link to="/productos" className="nav-link">
              Productos
            </Link>

            {user && (
              <Link to="/mis-pedidos" className="nav-link">
                Mis Pedidos
              </Link>
            )}

            {isAdmin() && (
              <Link to="/admin" className="nav-link admin-link">
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Acciones de usuario */}
          <div className="header-actions">
            {/* Carrito */}
            <Link to="/carrito" className="cart-button">
              🛒
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </Link>

            {/* Usuario */}
            {user ? (
              <div className="user-menu">
                <span className="user-name">Hola, {user.nombre}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-primary">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
