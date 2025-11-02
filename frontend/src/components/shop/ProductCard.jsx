import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { _id, nombre, marca, precio, volumen, imagenes, stock } = product;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  return (
    <Link to={`/productos/${_id}`} className="product-card">
      <div className="product-image">
        {imagenes && imagenes.length > 0 ? (
          <img
            src={`http://localhost:5000${imagenes[0]}`}
            alt={nombre}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
            }}
          />
        ) : (
          <div className="no-image">Sin imagen</div>
        )}
        {stock <= 0 && <div className="out-of-stock-badge">Agotado</div>}
      </div>

      <div className="product-info">
        <p className="product-brand">{marca}</p>
        <h3 className="product-name">{nombre}</h3>
        <p className="product-volume">{volumen}</p>
        <p className="product-price">{formatPrice(precio)}</p>
        {stock > 0 && stock <= 5 && (
          <p className="low-stock">¡Solo quedan {stock}!</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
