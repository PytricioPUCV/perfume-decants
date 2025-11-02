import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await api.get('/orders/mis-pedidos');

      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (estado) => {
    const colors = {
      pendiente: '#ffc107',
      pagado: '#28a745',
      procesando: '#17a2b8',
      enviado: '#007bff',
      entregado: '#28a745',
      cancelado: '#dc3545',
    };
    return colors[estado] || '#6c757d';
  };

  const getStatusText = (estado) => {
    const texts = {
      pendiente: 'Pendiente',
      pagado: 'Pagado',
      procesando: 'Procesando',
      enviado: 'Enviado',
      entregado: 'Entregado',
      cancelado: 'Cancelado',
    };
    return texts[estado] || estado;
  };

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="container">
          <h1>Mis Pedidos</h1>
          <div className="loading">Cargando pedidos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-orders-page">
        <div className="container">
          <h1>Mis Pedidos</h1>
          <div className="error-message">{error}</div>
          <button onClick={fetchOrders} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="my-orders-page">
        <div className="container">
          <h1>Mis Pedidos</h1>
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h2>Aún no tienes pedidos</h2>
            <p>Cuando realices una compra, aparecerá aquí</p>
            <button onClick={() => navigate('/productos')} className="btn btn-primary">
              Explorar Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <h1>Mis Pedidos</h1>
        <p className="orders-count">
          Tienes {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
        </p>

        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* Header del pedido */}
              <div className="order-header">
                <div className="order-header-left">
                  <h3>Pedido #{order._id.slice(-8).toUpperCase()}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div className="order-header-right">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.estado) }}
                  >
                    {getStatusText(order.estado)}
                  </span>
                </div>
              </div>

              {/* Productos del pedido */}
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="order-item-image">
                      {item.productId?.imagenes && item.productId.imagenes.length > 0 ? (
                        <img
                          src={`http://localhost:5000${item.productId.imagenes[0]}`}
                          alt={item.nombre}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60x60?text=Sin+Imagen';
                          }}
                        />
                      ) : (
                        <div className="no-image-small">Sin imagen</div>
                      )}
                    </div>
                    <div className="order-item-info">
                      <p className="item-name">{item.nombre}</p>
                      <p className="item-details">
                        {item.volumen} × {item.cantidad}
                      </p>
                    </div>
                    <p className="item-price">{formatPrice(item.subtotal)}</p>
                  </div>
                ))}
              </div>

              {/* Footer del pedido */}
              <div className="order-footer">
                <div className="order-info">
                  <div className="info-item">
                    <span className="info-label">Dirección:</span>
                    <span className="info-value">
                      {order.direccionEnvio.calle}, {order.direccionEnvio.ciudad}
                    </span>
                  </div>
                  {order.notasCliente && (
                    <div className="info-item">
                      <span className="info-label">Notas:</span>
                      <span className="info-value">{order.notasCliente}</span>
                    </div>
                  )}
                </div>

                <div className="order-total">
                  <span className="total-label">Total:</span>
                  <span className="total-amount">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="order-actions">
                <button
                  onClick={() => navigate(`/pedido/${order._id}`)}
                  className="btn btn-secondary btn-sm"
                >
                  Ver Detalles
                </button>
                {order.estado === 'entregado' && (
                  <button className="btn btn-primary btn-sm">Volver a Comprar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
