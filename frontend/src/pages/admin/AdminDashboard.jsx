import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Obtener estadísticas de pedidos
      const { data: ordersData } = await api.get('/orders?limit=100');
      
      if (ordersData.success) {
        setStats({
          totalOrders: ordersData.pagination.total,
          totalRevenue: ordersData.stats?.totalVentas || 0,
          pendingOrders: ordersData.stats?.pedidosPendientes || 0,
        });

        // Obtener los últimos 5 pedidos
        setRecentOrders(ordersData.data.slice(0, 5));
      }

      // Obtener estadísticas de ventas
      const { data: statsData } = await api.get('/orders/stats/ventas?periodo=mes');
      if (statsData.success) {
        setTopProducts(statsData.data.topProductos || []);
      }

      // Obtener total de productos
      const { data: productsData } = await api.get('/products?limit=1');
      if (productsData.success) {
        setStats(prev => ({ ...prev, totalProducts: productsData.pagination.total }));
      }

    } catch (error) {
      console.error('Error al cargar dashboard:', error);
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
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Cargando estadísticas...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>

      {/* Tarjetas de estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e3f2fd' }}>📦</div>
          <div className="stat-info">
            <h3>Total Productos</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fff3e0' }}>🛍️</div>
          <div className="stat-info">
            <h3>Total Pedidos</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e8f5e9' }}>💰</div>
          <div className="stat-info">
            <h3>Ingresos Totales</h3>
            <p className="stat-value">{formatPrice(stats.totalRevenue)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fce4ec' }}>⏳</div>
          <div className="stat-info">
            <h3>Pedidos Pendientes</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Pedidos recientes */}
        <div className="dashboard-section">
          <h2>Pedidos Recientes</h2>
          {recentOrders.length > 0 ? (
            <div className="recent-orders">
              {recentOrders.map((order) => (
                <div key={order._id} className="recent-order-item">
                  <div className="order-info">
                    <p className="order-id">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="order-customer">{order.userId?.nombre || 'Usuario'}</p>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.estado}`}>
                      {order.estado}
                    </span>
                  </div>
                  <div className="order-total">
                    <p>{formatPrice(order.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No hay pedidos recientes</p>
          )}
        </div>

        {/* Top productos */}
        <div className="dashboard-section">
          <h2>Productos Más Vendidos</h2>
          {topProducts.length > 0 ? (
            <div className="top-products">
              {topProducts.map((product, index) => (
                <div key={product._id} className="top-product-item">
                  <span className="product-rank">#{index + 1}</span>
                  <div className="product-info">
                    <p className="product-name">{product.nombre}</p>
                    <p className="product-sales">{product.totalVendido} ventas</p>
                  </div>
                  <div className="product-revenue">
                    <p>{formatPrice(product.ingresos)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No hay datos de ventas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
