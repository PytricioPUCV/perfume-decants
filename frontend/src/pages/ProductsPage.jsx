import { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/shop/ProductCard';
import Filters from '../components/shop/Filters';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      // Construir query params
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      const { data } = await api.get(`/products?${params}`);

      if (data.success) {
        setProducts(data.data);
        setPagination({
          ...pagination,
          total: data.pagination.total,
          pages: data.pagination.pages,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset a página 1
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1>Nuestros Productos</h1>

        <div className="products-layout">
          {/* Sidebar con filtros */}
          <Filters onFilterChange={handleFilterChange} />

          {/* Grid de productos */}
          <div className="products-section">
            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading">Cargando productos...</div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <p>No se encontraron productos</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Paginación */}
                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="page-button"
                    >
                      Anterior
                    </button>

                    <span className="page-info">
                      Página {pagination.page} de {pagination.pages}
                    </span>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="page-button"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
