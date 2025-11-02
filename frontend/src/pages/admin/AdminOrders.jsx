import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todos');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders?limit=100');
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/estado`, { estado: newStatus });
      alert('Estado actualizado exitosamente');
      fetchOrders();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // Nueva función para eliminar pedido
  const handleDeleteOrder = async (orderId) => {
    const orderIdShort = orderId.slice(-8).toUpperCase();
    
    const confirmDelete = window.confirm(
      `⚠️ ¿Estás seguro de eliminar el pedido #${orderIdShort}?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const { data } = await api.delete(`/orders/${orderId}`);

      if (data.success) {
        alert('✅ Pedido eliminado exitosamente');
        fetchOrders(); // Recargar lista
      }
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      alert('❌ Error al eliminar pedido: ' + error.message);
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
      day: '2-digit',
      month: 'short',
      year: 'numeric',
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

  const filteredOrders = filter === 'todos' 
    ? orders 
    : orders.filter(order => order.estado === filter);

  if (loading) {
    return <div className="loading">Cargando pedidos...</div>;
  }

  return (
    <div className="admin-orders">
      <h1>Gestión de Pedidos</h1>

      {/* Filtros */}
      <div className="orders-filters">
        <button
          className={filter === 'todos' ? 'active' : ''}
          onClick={() => setFilter('todos')}
        >
          Todos ({orders.length})
        </button>
        <button
          className={filter === 'pendiente' ? 'active' : ''}
          onClick={() => setFilter('pendiente')}
        >
          Pendientes ({orders.filter(o => o.estado === 'pendiente').length})
        </button>
        <button
          className={filter === 'pagado' ? 'active' : ''}
          onClick={() => setFilter('pagado')}
        >
          Pagados ({orders.filter(o => o.estado === 'pagado').length})
        </button>
        <button
          className={filter === 'procesando' ? 'active' : ''}
          onClick={() => setFilter('procesando')}
        >
          Procesando ({orders.filter(o => o.estado === 'procesando').length})
        </button>
        <button
          className={filter === 'enviado' ? 'active' : ''}
          onClick={() => setFilter('enviado')}
        >
          Enviados ({orders.filter(o => o.estado === 'enviado').length})
        </button>
      </div>

      {/* Lista de pedidos */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No hay pedidos con este estado</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="order-admin-card">
              {/* Header */}
              <div className="order-admin-header">
                <div>
                  <h3>Pedido #{order._id.slice(-8).toUpperCase()}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div className="header-actions">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.estado) }}
                  >
                    {order.estado}
                  </span>
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="btn-delete-order"
                    title="Eliminar pedido"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Cliente */}
              <div className="order-customer-info">
                <div className="info-group">
                  <strong>Cliente:</strong>
                  <span>{order.userId?.nombre || 'N/A'}</span>
                </div>
                <div className="info-group">
                  <strong>Email:</strong>
                  <span>{order.userId?.email || 'N/A'}</span>
                </div>
                <div className="info-group">
                  <strong>Teléfono:</strong>
                  <span>{order.userId?.telefono || 'N/A'}</span>
                </div>
              </div>

              {/* Dirección */}
              <div className="order-address">
                <strong>Dirección de Envío:</strong>
                <p>
                  {order.direccionEnvio.calle}, {order.direccionEnvio.ciudad},{' '}
                  {order.direccionEnvio.region} - CP: {order.direccionEnvio.codigoPostal}
                </p>
                {order.notasCliente && (
                  <p className="order-notes">
                    <strong>Notas:</strong> {order.notasCliente}
                  </p>
                )}
              </div>

              {/* Productos */}
              <div className="order-admin-items">
                <strong>Productos:</strong>
                {order.items.map((item, index) => (
                  <div key={index} className="order-admin-item">
                    <span>
                      {item.nombre} ({item.volumen}) x {item.cantidad}
                    </span>
                    <span>{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              {/* Total y Acciones */}
              <div className="order-admin-footer">
                <div className="order-total-admin">
                  <strong>Total:</strong>
                  <span className="total-amount">{formatPrice(order.total)}</span>
                </div>

                <div className="order-actions-admin">
                  <label>Cambiar Estado:</label>
                  <select
                    value={order.estado}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="procesando">Procesando</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
