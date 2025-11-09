import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    descripcion: '',
    precio: '',
    stock: '',
    volumen: '5ml',
    categoria: 'primavera', // Cambiado
    genero: 'unisex',
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products?limit=100');
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setCurrentImages(product.imagenes || []);
      setFormData({
        nombre: product.nombre,
        marca: product.marca,
        descripcion: product.descripcion,
        precio: product.precio,
        stock: product.stock,
        volumen: product.volumen,
        categoria: product.categoria,
        genero: product.genero,
      });
    } else {
      setEditingProduct(null);
      setCurrentImages([]);
      setFormData({
        nombre: '',
        marca: '',
        descripcion: '',
        precio: '',
        stock: '',
        volumen: '5ml',
        categoria: '',
        genero: 'unisex',
      });
    }
    setImages([]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setCurrentImages([]); // ← Limpiar imágenes
    setFormData({
      nombre: '',
      marca: '',
      descripcion: '',
      precio: '',
      stock: '',
      volumen: '5ml',
      categoria: '',
      genero: 'unisex',
    });
    setImages([]);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    
    // Agregar campos de texto
    Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
    });

    // Agregar imágenes (verificar que existan)
    if (images && images.length > 0) {
        images.forEach((image) => {
        data.append('imagenes', image);
        });
        console.log('📸 Imágenes agregadas:', images.length);
    } else {
        console.log('⚠️ No hay imágenes seleccionadas');
    }

    // Debug: Ver qué hay en el FormData
    console.log('📦 FormData contenido:');
    for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
    }

    try {
        if (editingProduct) {
        const response = await api.put(`/products/${editingProduct._id}`, data, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Respuesta:', response.data);
        alert('Producto actualizado exitosamente');
        } else {
        const response = await api.post('/products', data, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        console.log('Respuesta:', response.data);
        alert('Producto creado exitosamente');
        }
        handleCloseModal();
        fetchProducts();
    } catch (error) {
        if (error.status === 429) {
        alert('Has excedido el límite de peticiones. Espera unos minutos o reinicia el servidor.');
        } else {
        alert('Error: ' + error.message);
        }
        console.error('Error completo:', error);
        }
    };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await api.delete(`/products/${id}`);
        alert('Producto eliminado');
        fetchProducts();
      } catch (error) {
        alert('Error: ' + error.message);
      }
    }
  };

  const handleDeleteImage = async (imagenUrl, index) => {
    console.log('🔍 Eliminando índice:', index);
    
    if (!window.confirm('¿Estás seguro de eliminar esta imagen?')) {
      return;
    }

    try {
      const response = await api.delete(`/products/${editingProduct._id}/imagen/${index}`);

      if (response.data.success) {
        // Actualizar el estado local
        setCurrentImages(currentImages.filter((_, i) => i !== index));
        alert('Imagen eliminada exitosamente');
        
        // Opcional: Recargar el producto completo
        // fetchProducts();
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al eliminar imagen: ' + (error.response?.data?.error || error.message));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div className="admin-products">
      <div className="products-header">
        <h1>Gestión de Productos</h1>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          + Nuevo Producto
        </button>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Volumen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.imagenes && product.imagenes.length > 0 ? (
                    <img
                      src={`http://localhost:5000${product.imagenes[0]}`}
                      alt={product.nombre}
                      className="product-thumb"
                    />
                  ) : (
                    <div className="no-image">Sin imagen</div>
                  )}
                </td>
                <td>{product.nombre}</td>
                <td>{product.marca}</td>
                <td>{formatPrice(product.precio)}</td>
                <td>
                  <span className={product.stock <= 5 ? 'stock-low' : ''}>
                    {product.stock}
                  </span>
                </td>
                <td>{product.volumen}</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="btn-edit"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn-delete"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            {editingProduct && currentImages.length > 0 && (
              <div className="current-images-section">
                <h3>Imágenes Actuales</h3>
                <div className="current-images-grid">
                  {currentImages.map((img, index) => (
                    <div key={index} className="current-image-item">
                      <img 
                        src={`http://localhost:5000${img}`} 
                        alt={`Imagen ${index + 1}`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=Error';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img, index)}
                        className="btn-delete-image"
                        title="Eliminar imagen"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    className="input"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Marca *</label>
                  <input
                    type="text"
                    name="marca"
                    className="input"
                    value={formData.marca}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  className="input"
                  rows="3"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    name="precio"
                    className="input"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    className="input"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Volumen *</label>
                  <select
                    name="volumen"
                    className="input"
                    value={formData.volumen}
                    onChange={handleChange}
                  >
                    <option value="5ml">5ml</option>
                    <option value="10ml">10ml</option>
                    <option value="30ml">30ml</option>
                    <option value="50ml">50ml</option>
                    <option value="100ml">100ml</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría (Estación) *</label>
                  <select
                    name="categoria"
                    className="input"
                    value={formData.categoria}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona una estación</option>
                    <option value="verano">Verano</option>
                    <option value="invierno">Invierno</option>
                    <option value="otoño">Otoño</option>
                    <option value="primavera">Primavera</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Género *</label>
                  <select
                    name="genero"
                    className="input"
                    value={formData.genero}
                    onChange={handleChange}
                  >
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Imágenes (máx 5)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="input"
                />
                {images.length > 0 && (
                  <p className="form-hint">{images.length} archivo(s) seleccionado(s)</p>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
