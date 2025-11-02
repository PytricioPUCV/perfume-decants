import { useState } from 'react';
import './Filters.css';

const Filters = ({ onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({
    categoria: '',
    genero: '',
    precioMin: '',
    precioMax: '',
    buscar: '',
    ordenar: '',
  });

  const handleChange = (filterName, value) => {
    const newFilters = {
      ...localFilters,
      [filterName]: value,
    };
    setLocalFilters(newFilters);
    
    const activeFilters = {};
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) {
        activeFilters[key] = newFilters[key];
      }
    });
    
    onFilterChange(activeFilters);
  };

  const handleClear = () => {
    const clearedFilters = {
      categoria: '',
      genero: '',
      precioMin: '',
      precioMax: '',
      buscar: '',
      ordenar: '',
    };
    setLocalFilters(clearedFilters);
    onFilterChange({});
  };

  return (
    <aside className="filters-sidebar">
      <h2>Filtros</h2>

      {/* Categoría - Ahora Estaciones */}
      <div className="filter-section">
        <h3>Estación</h3>
        <div className="filter-content">
          {[
            { value: 'primavera', label: 'Primavera', emoji: '🌸' },
            { value: 'verano', label: 'Verano', emoji: '☀️' },
            { value: 'otoño', label: 'Otoño', emoji: '🍂' },
            { value: 'invierno', label: 'Invierno', emoji: '❄️' }
          ].map((estacion) => (
            <div key={estacion.value} className="filter-option">
              <input
                type="radio"
                id={`cat-${estacion.value}`}
                name="categoria"
                checked={localFilters.categoria === estacion.value}
                onChange={() => handleChange('categoria', estacion.value)}
              />
              <label htmlFor={`cat-${estacion.value}`}>
                {estacion.emoji} {estacion.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Género */}
      <div className="filter-section">
        <h3>Género</h3>
        <div className="filter-content">
          {['masculino', 'femenino', 'unisex'].map((gen) => (
            <div key={gen} className="filter-option">
              <input
                type="radio"
                id={`gen-${gen}`}
                name="genero"
                checked={localFilters.genero === gen}
                onChange={() => handleChange('genero', gen)}
              />
              <label htmlFor={`gen-${gen}`}>
                {gen.charAt(0).toUpperCase() + gen.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div className="filter-section">
        <h3>Rango de Precio</h3>
        <div className="filter-content">
          <div className="price-range">
            <div className="price-input">
              <label>Mínimo</label>
              <input
                type="number"
                placeholder="$0"
                value={localFilters.precioMin}
                onChange={(e) => handleChange('precioMin', e.target.value)}
              />
            </div>
            <span className="price-separator">-</span>
            <div className="price-input">
              <label>Máximo</label>
              <input
                type="number"
                placeholder="$50.000"
                value={localFilters.precioMax}
                onChange={(e) => handleChange('precioMax', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleClear} className="clear-filters">
        Limpiar Filtros
      </button>
    </aside>
  );
};

export default Filters;
