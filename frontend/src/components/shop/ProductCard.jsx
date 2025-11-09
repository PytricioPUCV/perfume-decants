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

  // ✅ CORRECCIÓN: Usar directamente la URL de Cloudinary
  const imagenUrl = imagenes && imagenes.length > 0
    ? imagenes[0]  // URL completa de Cloudinary
    : 'https://via.placeholder.com/500x500?text=Sin+Imagen';

  return (
    <Link to={`/productos/${_id}`} className="product-card">
      <div className="product-image-container">
        <img 
          src={imagenUrl} 
          alt={nombre} 
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500x500?text=Error+al+Cargar';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{nombre}</h3>
        <p className="product-brand">{marca}</p>
        <p className="product-volume">{volumen}</p>
        <p className="product-price">{formatPrice(precio)}</p>
        {stock > 0 && stock <= 5 && (
          <p className="product-low-stock">¡Solo quedan {stock}!</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
