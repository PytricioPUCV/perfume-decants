import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart, getTotalItems } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const subtotal = getSubtotal();
  const envio = subtotal > 0 ? 3000 : 0; // $3.000 de envío
  const total = subtotal + envio;

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Carrito de Compras</h1>
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos para comenzar tu compra</p>
            <button onClick={() => navigate('/productos')} className="btn btn-primary">
              Ir a Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Carrito de Compras</h1>
          <p className="cart-count">
            {getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        <div className="cart-layout">
          {/* Lista de productos */}
          <div className="cart-items-section">
            <div className="cart-actions">
              <button onClick={handleClearCart} className="btn btn-secondary">
                Vaciar Carrito
              </button>
              <button onClick={() => navigate('/productos')} className="btn btn-secondary">
                Seguir Comprando
              </button>
            </div>

            <div className="cart-items-list">
              {items.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="cart-summary">
            <h2>Resumen del Pedido</h2>

            <div className="summary-row">
              <span>Subtotal ({getTotalItems()} productos):</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Envío:</span>
              <span>{formatPrice(envio)}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Total:</span>
              <span className="total-amount">{formatPrice(total)}</span>
            </div>

            <button onClick={handleCheckout} className="btn btn-primary btn-checkout">
              Proceder al Pago
            </button>

            <div className="payment-methods">
              <p>Aceptamos:</p>
              <div className="payment-icons">
                <span>💳</span>
                <span>🏦</span>
              </div>
            </div>

            <div className="cart-info">
              <p>✓ Envío gratis en compras sobre $50.000</p>
              <p>✓ Garantía de satisfacción</p>
              <p>✓ Pago seguro</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
