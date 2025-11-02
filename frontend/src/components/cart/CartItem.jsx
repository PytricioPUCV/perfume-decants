import { useCart } from '../../context/CartContext';
import './CartItem.css';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      updateQuantity(item._id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (window.confirm(`¿Eliminar "${item.nombre}" del carrito?`)) {
      removeItem(item._id);
    }
  };

  const subtotal = item.precio * item.quantity;

  return (
    <div className="cart-item">
      {/* Imagen del producto */}
      <div className="cart-item-image">
        {item.imagenes && item.imagenes.length > 0 ? (
          <img
            src={`http://localhost:5000${item.imagenes[0]}`}
            alt={item.nombre}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/100x100?text=Sin+Imagen';
            }}
          />
        ) : (
          <div className="no-image-small">Sin imagen</div>
        )}
      </div>

      {/* Información del producto */}
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.nombre}</h3>
        <p className="cart-item-brand">{item.marca}</p>
        <p className="cart-item-volume">{item.volumen}</p>
        <p className="cart-item-price">{formatPrice(item.precio)} c/u</p>
      </div>

      {/* Controles de cantidad */}
      <div className="cart-item-quantity">
        <label>Cantidad:</label>
        <div className="quantity-controls">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1}
            className="btn-quantity"
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span className="quantity-display">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={item.quantity >= item.stock}
            className="btn-quantity"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
        {item.quantity >= item.stock && (
          <p className="stock-warning">Stock máximo</p>
        )}
      </div>

      {/* Subtotal */}
      <div className="cart-item-subtotal">
        <p className="subtotal-label">Subtotal:</p>
        <p className="subtotal-amount">{formatPrice(subtotal)}</p>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={handleRemove}
        className="btn-remove"
        aria-label={`Eliminar ${item.nombre}`}
      >
        🗑️
      </button>
    </div>
  );
};

export default CartItem;
