import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    calle: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    notasCliente: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getSubtotal();
  const envio = 3000;
  const total = subtotal + envio;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Validar que haya productos en el carrito
      if (items.length === 0) {
        setError('El carrito está vacío');
        setLoading(false);
        return;
      }

      // 2. Crear el pedido en el backend
      const orderData = {
        items: items.map(item => ({
          productId: item._id,
          cantidad: item.quantity,
        })),
        direccionEnvio: {
          calle: formData.calle,
          ciudad: formData.ciudad,
          region: formData.region,
          codigoPostal: formData.codigoPostal,
        },
        metodoPago: 'mercadopago',
        notasCliente: formData.notasCliente,
      };

      const { data: orderResponse } = await api.post('/orders', orderData);

      if (!orderResponse.success) {
        throw new Error(orderResponse.error || 'Error al crear el pedido');
      }

      const orderId = orderResponse.data._id;

      // 3. Crear preferencia de pago (mock)
      const { data: paymentResponse } = await api.post('/payments/create-preference', {
        orderId: orderId,
      });

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error || 'Error al procesar el pago');
      }

      // 4. Simular pago exitoso automáticamente (modo mock)
      await api.post('/payments/mock-payment', {
        orderId: orderId,
        estado: 'approved',
      });

      // 5. Limpiar carrito
      clearCart();

      // 6. Redirigir a página de éxito
      navigate(`/pago/exitoso?order=${orderId}`);

    } catch (err) {
      console.error('Error en checkout:', err);
      setError(err.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <h2>No hay productos en el carrito</h2>
            <p>Agrega productos antes de proceder al checkout</p>
            <button onClick={() => navigate('/productos')} className="btn btn-primary">
              Ir a Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Finalizar Compra</h1>

        <div className="checkout-layout">
          {/* Formulario de envío */}
          <div className="checkout-form-section">
            <div className="section-card">
              <h2>Información de Envío</h2>
              
              <form onSubmit={handleSubmit} className="checkout-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                  <label htmlFor="calle">Dirección *</label>
                  <input
                    type="text"
                    id="calle"
                    name="calle"
                    className="input"
                    placeholder="Calle, número, departamento"
                    value={formData.calle}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ciudad">Ciudad *</label>
                    <input
                      type="text"
                      id="ciudad"
                      name="ciudad"
                      className="input"
                      placeholder="Santiago"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="region">Región *</label>
                    <select
                      id="region"
                      name="region"
                      className="input"
                      value={formData.region}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Metropolitana">Metropolitana</option>
                      <option value="Valparaíso">Valparaíso</option>
                      <option value="Biobío">Biobío</option>
                      <option value="Araucanía">Araucanía</option>
                      <option value="Los Lagos">Los Lagos</option>
                      <option value="Maule">Maule</option>
                      <option value="Antofagasta">Antofagasta</option>
                      <option value="Coquimbo">Coquimbo</option>
                      <option value="O'Higgins">O'Higgins</option>
                      <option value="Tarapacá">Tarapacá</option>
                      <option value="Atacama">Atacama</option>
                      <option value="Los Ríos">Los Ríos</option>
                      <option value="Aysén">Aysén</option>
                      <option value="Magallanes">Magallanes</option>
                      <option value="Arica y Parinacota">Arica y Parinacota</option>
                      <option value="Ñuble">Ñuble</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="codigoPostal">Código Postal *</label>
                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    className="input"
                    placeholder="1234567"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notasCliente">Notas de Entrega (Opcional)</label>
                  <textarea
                    id="notasCliente"
                    name="notasCliente"
                    className="input textarea"
                    rows="3"
                    placeholder="Ej: Dejar en portería, timbrar al 301..."
                    value={formData.notasCliente}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Realizar Pedido'}
                </button>
              </form>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="checkout-summary-section">
            <div className="section-card">
              <h2>Resumen del Pedido</h2>

              <div className="order-items">
                {items.map((item) => (
                  <div key={item._id} className="order-item">
                    <div className="order-item-image">
                      {item.imagenes && item.imagenes.length > 0 ? (
                        <img
                          src={`http://localhost:5000${item.imagenes[0]}`}
                          alt={item.nombre}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/60x60?text=Sin+Imagen';
                          }}
                        />
                      ) : (
                        <div className="no-image-tiny">Sin imagen</div>
                      )}
                    </div>
                    <div className="order-item-info">
                      <p className="order-item-name">{item.nombre}</p>
                      <p className="order-item-details">
                        {item.volumen} × {item.quantity}
                      </p>
                    </div>
                    <p className="order-item-price">
                      {formatPrice(item.precio * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Envío:</span>
                  <span>{formatPrice(envio)}</span>
                </div>
                <div className="total-divider"></div>
                <div className="total-row total-final">
                  <span>Total a Pagar:</span>
                  <span className="total-amount">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="checkout-info">
                <p>✓ Pago 100% seguro</p>
                <p>✓ Envío en 24-48 horas</p>
                <p>✓ Garantía de devolución</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
