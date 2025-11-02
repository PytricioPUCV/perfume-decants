import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/shop/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      // Obtener los 8 productos más recientes
      const { data } = await api.get('/products?limit=8');
      if (data.success) {
        setFeaturedProducts(data.data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Primavera', icon: '🌸', value: 'primavera' },
    { name: 'Verano', icon: '☀️', value: 'verano' },
    { name: 'Otoño', icon: '🍂', value: 'otoño' },
    { name: 'Invierno', icon: '❄️', value: 'invierno' },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/productos?categoria=${category}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Decants del Puerto
              </h1>
              <p className="hero-subtitle">
                Las mejores fragancias en pequeñas muestras
              </p>
              <p className="hero-description">
                Descubre perfumes de lujo sin comprometerte con el frasco completo.
                Calidad premium, precios accesibles.
              </p>
              <div className="hero-buttons">
                <button onClick={() => navigate('/productos')} className="btn btn-primary btn-large">
                  Explorar Productos
                </button>
                <button onClick={() => navigate('/productos')} className="btn btn-secondary btn-large">
                  Ver Catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Explora por Categoría</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category.value}
                className="category-card"
                onClick={() => handleCategoryClick(category.value)}
              >
                <div className="category-icon">{category.icon}</div>
                <h3 className="category-name">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Productos Destacados</h2>
            <button onClick={() => navigate('/productos')} className="btn btn-secondary">
              Ver Todos
            </button>
          </div>

          {loading ? (
            <div className="loading">Cargando productos...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Beneficios */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">¿Por qué Comprar con Nosotros?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🧴</div>
              <h3>Productos Auténticos</h3>
              <p>Todas nuestras fragancias son 100% originales y garantizadas</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Precios Accesibles</h3>
              <p>Prueba perfumes de lujo sin gastar en el frasco completo</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🚚</div>
              <h3>Envío Rápido</h3>
              <p>Entrega en 24-48 horas a todo Chile</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">✅</div>
              <h3>Garantía de Calidad</h3>
              <p>Si no estás satisfecho, te devolvemos tu dinero</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para Descubrir tu Nueva Fragancia?</h2>
            <p>Explora nuestro catálogo completo y encuentra el perfume perfecto para ti</p>
            <button onClick={() => navigate('/productos')} className="btn btn-primary btn-large">
              Explorar Ahora
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;