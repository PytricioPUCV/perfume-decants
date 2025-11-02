import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error al cargar pedido:', error);
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

  if (loading) {
    return (
      <div className="order-success-page">
        <div className="container">
          <div className="loading">Cargando información del pedido...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>¡Pedido Realizado con Éxito!</h1>
          <p className="success-message">
            Tu pedido ha sido confirmado y está siendo procesado
          </p>

          {order && (
            <div className="order-details">
              <div className="detail-row">
                <span className="detail-label">Número de Pedido:</span>
                <span className="detail-value">#{order._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Fecha:</span>
                <span className="detail-value">
                  {new Date(order.createdAt).toLocaleDateString('es-CL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total:</span>
                <span className="detail-value total">{formatPrice(order.total)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Estado:</span>
                <span className="detail-value status-badge">{order.estado}</span>
              </div>
            </div>
          )}

          <div className="next-steps">
            <h3>¿Qué sigue?</h3>
            <ul>
              <li>📧 Recibirás un correo de confirmación</li>
              <li>📦 Tu pedido será preparado en 24-48 horas</li>
              <li>🚚 Recibirás un código de seguimiento</li>
              <li>📱 Puedes ver el estado en "Mis Pedidos"</li>
            </ul>
          </div>

          <div className="success-actions">
            <button onClick={() => navigate('/mis-pedidos')} className="btn btn-primary">
              Ver Mis Pedidos
            </button>
            <button onClick={() => navigate('/productos')} className="btn btn-secondary">
              Seguir Comprando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
