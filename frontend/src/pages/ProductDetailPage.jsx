import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem, isInCart, getItemQuantity } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await api.get(`/products/${id}`);

      if (data.success) {
        setProduct(data.data);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product.stock < quantity) {
      setMessage('Stock insuficiente');
      return;
    }

    addItem(product, quantity);
    setMessage(`${quantity} ${quantity === 1 ? 'unidad agregada' : 'unidades agregadas'} al carrito`);
    
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading">Cargando producto...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-message">{error || 'Producto no encontrado'}</div>
          <button onClick={() => navigate('/productos')} className="btn btn-primary">
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a onClick={() => navigate('/')}>Inicio</a>
          <span> / </span>
          <a onClick={() => navigate('/productos')}>Productos</a>
          <span> / </span>
          <span>{product.nombre}</span>
        </div>

        <div className="product-detail-container">
          {/* Galería de imágenes */}
          <div className="product-gallery">
            <div className="main-image">
              {product.imagenes && product.imagenes.length > 0 ? (
                <img
                  src={`http://localhost:5000${product.imagenes[selectedImage]}`}
                  alt={product.nombre}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x500?text=Sin+Imagen';
                  }}
                />
              ) : (
                <div className="no-image-large">Sin imagen disponible</div>
              )}
            </div>

            {product.imagenes && product.imagenes.length > 1 && (
              <div className="image-thumbnails">
                {product.imagenes.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={`http://localhost:5000${img}`}
                      alt={`${product.nombre} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="product-info-section">
            <p className="product-brand">{product.marca}</p>
            <h1 className="product-title">{product.nombre}</h1>

            <div className="product-meta">
              <span className="badge">{product.categoria}</span>
              <span className="badge">{product.genero}</span>
              <span className="badge">{product.volumen}</span>
            </div>

            <div className="product-price-section">
              <p className="price">{formatPrice(product.precio)}</p>
              {product.stock > 0 ? (
                <p className="stock-status in-stock">✓ En stock ({product.stock} disponibles)</p>
              ) : (
                <p className="stock-status out-of-stock">✗ Agotado</p>
              )}
            </div>

            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.descripcion}</p>
            </div>

            {/* Selector de cantidad y botón agregar */}
            {product.stock > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <label>Cantidad:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="btn-quantity"
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      className="btn-quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-add-to-cart"
                >
                  🛒 Agregar al Carrito
                </button>

                {isInCart(product._id) && (
                  <p className="in-cart-message">
                    Ya tienes {getItemQuantity(product._id)} en el carrito
                  </p>
                )}

                {message && <div className="success-message">{message}</div>}
              </div>
            )}

            {/* Información adicional */}
            <div className="product-additional-info">
              <div className="info-item">
                <strong>SKU:</strong> {product._id.slice(-8).toUpperCase()}
              </div>
              <div className="info-item">
                <strong>Fecha de registro:</strong>{' '}
                {new Date(product.createdAt).toLocaleDateString('es-CL')}
              </div>
            </div>
          </div>
        </div>

        {/* Botón volver */}
        <div className="back-button-container">
          <button onClick={() => navigate('/productos')} className="btn btn-secondary">
            ← Volver a Productos
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
