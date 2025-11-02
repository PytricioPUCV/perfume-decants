import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Obtener todos los productos (con paginación y filtros)
// @route   GET /api/products
// @access  Público
export const obtenerProductos = async (req, res) => {
  try {
    // Parámetros de query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Construir filtros
    const filtros = { activo: true };

    // Filtro por categoría
    if (req.query.categoria) {
      filtros.categoria = req.query.categoria;
    }

    // Filtro por género
    if (req.query.genero) {
      filtros.genero = req.query.genero;
    }

    // Filtro por rango de precio
    if (req.query.precioMin || req.query.precioMax) {
      filtros.precio = {};
      if (req.query.precioMin) filtros.precio.$gte = parseFloat(req.query.precioMin);
      if (req.query.precioMax) filtros.precio.$lte = parseFloat(req.query.precioMax);
    }

    // Búsqueda por texto
    if (req.query.buscar) {
      filtros.$text = { $search: req.query.buscar };
    }

    // Configurar ordenamiento
    let ordenamiento = {};
    switch (req.query.ordenar) {
      case 'precio-asc':
        ordenamiento = { precio: 1 };
        break;
      case 'precio-desc':
        ordenamiento = { precio: -1 };
        break;
      case 'nombre':
        ordenamiento = { nombre: 1 };
        break;
      case 'mas-vendidos':
        ordenamiento = { ventas: -1 };
        break;
      default:
        ordenamiento = { createdAt: -1 }; // Más recientes primero
    }

    // Ejecutar query
    const productos = await Product.find(filtros)
      .sort(ordenamiento)
      .limit(limit)
      .skip(skip)
      .lean();

    // Contar total de documentos
    const total = await Product.countDocuments(filtros);

    res.json({
      success: true,
      data: productos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos',
      detalles: error.message 
    });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Público
export const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({
      success: true,
      data: producto
    });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ 
      error: 'Error al obtener producto',
      detalles: error.message 
    });
  }
};

// @desc    Crear producto
// @route   POST /api/products
// @access  Privado/Admin
export const crearProducto = async (req, res) => {
  try {
    const { nombre, marca, descripcion, precio, stock, volumen, categoria, genero } = req.body;

    // Validar campos requeridos
    if (!nombre || !marca || !descripcion || !precio || !stock || !volumen || !categoria || !genero) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Procesar imágenes (opcional)
    const imagenes = [];
    if (req.files && req.files.length > 0) {
      imagenes.push(...req.files.map(file => `/uploads/products/${file.filename}`));
      console.log(`✅ ${req.files.length} imagen(es) procesada(s)`);
    } else {
      console.log('⚠️ Producto creado sin imágenes');
    }

    const producto = await Product.create({
      nombre,
      marca,
      descripcion,
      precio: Number(precio),
      stock: Number(stock),
      volumen,
      categoria,
      genero,
      imagenes
    });

    console.log('✅ Producto creado:', producto._id);

    res.status(201).json({
      success: true,
      data: producto
    });

  } catch (error) {
    console.error('❌ Error al crear producto:', error);
    res.status(500).json({ 
      error: 'Error al crear el producto',
      detalles: error.message 
    });
  }
};

// @desc    Actualizar producto
// @route   PUT /api/products/:id
// @access  Privado/Admin
export const actualizarProducto = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar campos
    const camposActualizables = ['nombre', 'marca', 'descripcion', 'volumen', 'precio', 'stock', 'categoria', 'genero', 'activo'];
    
    camposActualizables.forEach(campo => {
      if (req.body[campo] !== undefined) {
        producto[campo] = req.body[campo];
      }
    });

    // Si hay nuevas imágenes, agregarlas
    if (req.files && req.files.length > 0) {
      const nuevasImagenes = req.files.map(file => `/uploads/products/${file.filename}`);
      producto.imagenes = [...producto.imagenes, ...nuevasImagenes];
    }

    const productoActualizado = await producto.save();

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: productoActualizado
    });

  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ 
      error: 'Error al actualizar producto',
      detalles: error.message 
    });
  }
};

// @desc    Eliminar producto
// @route   DELETE /api/products/:id
// @access  Privado/Admin
export const eliminarProducto = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Eliminar imágenes del servidor
    producto.imagenes.forEach(imagenPath => {
      const fullPath = path.join(__dirname, '../../', imagenPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    // Eliminar producto
    await producto.deleteOne();

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ 
      error: 'Error al eliminar producto',
      detalles: error.message 
    });
  }
};

// @desc    Eliminar imagen específica de un producto
// @route   DELETE /api/products/:id/imagen/:index
// @access  Privado/Admin
export const eliminarImagenProducto = async (req, res) => {
  try {
    const { index } = req.params;
    const imagenIndex = parseInt(index);

    console.log('📸 Eliminando imagen en índice:', imagenIndex);

    if (isNaN(imagenIndex) || imagenIndex < 0) {
      return res.status(400).json({ error: 'Índice de imagen inválido' });
    }

    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    console.log('📸 Imágenes del producto:', producto.imagenes);

    if (imagenIndex >= producto.imagenes.length) {
      return res.status(400).json({ error: 'Índice fuera de rango' });
    }

    const imagenUrl = producto.imagenes[imagenIndex];
    console.log('📸 Eliminando:', imagenUrl);

    // Eliminar el archivo físico del servidor
    const fullPath = path.join(__dirname, '../../', imagenUrl);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log('✅ Archivo físico eliminado');
    } else {
      console.log('⚠️ Archivo no encontrado en disco');
    }

    // Eliminar del array
    producto.imagenes.splice(imagenIndex, 1);

    await producto.save();

    console.log('✅ Imagen eliminada exitosamente');

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente',
      data: producto
    });

  } catch (error) {
    console.error('❌ Error al eliminar imagen:', error);
    res.status(500).json({ 
      error: 'Error al eliminar imagen',
      detalles: error.message 
    });
  }
};

// @desc    Actualizar stock de un producto
// @route   PATCH /api/products/:id/stock
// @access  Privado/Admin
export const actualizarStock = async (req, res) => {
  try {
    const { cantidad, operacion } = req.body; // operacion: 'agregar' o 'establecer'

    if (!cantidad || cantidad < 0) {
      return res.status(400).json({ 
        error: 'Cantidad inválida' 
      });
    }

    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (operacion === 'agregar') {
      producto.stock += parseInt(cantidad);
    } else {
      producto.stock = parseInt(cantidad);
    }

    await producto.save();

    res.json({
      success: true,
      message: 'Stock actualizado exitosamente',
      data: {
        id: producto._id,
        nombre: producto.nombre,
        stock: producto.stock
      }
    });

  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ 
      error: 'Error al actualizar stock',
      detalles: error.message 
    });
  }
};
