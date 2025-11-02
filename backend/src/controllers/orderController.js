import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// @desc    Crear nuevo pedido
// @route   POST /api/orders
// @access  Privado
export const crearPedido = async (req, res) => {
  // --- VERSIÓN SIN TRANSACCIÓN (Compatible con M0) ---
  try {
    const { items, direccionEnvio, metodoPago, notasCliente } = req.body;
    const userId = req.user._id;

    // Validar que existan items
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        error: 'El pedido debe contener al menos un producto' 
      });
    }

    // Validar dirección de envío
    if (!direccionEnvio || !direccionEnvio.calle || !direccionEnvio.ciudad || 
        !direccionEnvio.region || !direccionEnvio.codigoPostal) {
      return res.status(400).json({ 
        error: 'La dirección de envío está incompleta' 
      });
    }

    // Procesar items y verificar disponibilidad
    const itemsProcesados = [];
    let totalPedido = 0;

    for (const item of items) {
      const producto = await Product.findById(item.productId);

      if (!producto) {
        return res.status(404).json({ 
          error: `Producto ${item.productId} no encontrado` 
        });
      }

      if (!producto.estaDisponible(item.cantidad)) {
        return res.status(400).json({ 
          error: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}` 
        });
      }

      const subtotal = producto.precio * item.cantidad;
      totalPedido += subtotal;

      itemsProcesados.push({
        productId: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        volumen: producto.volumen,
        cantidad: item.cantidad,
        subtotal: subtotal
      });

      // Reducir stock del producto
      // (Lo hacemos aquí, antes de crear la orden)
      await producto.reducirStock(item.cantidad);
    }

    // Crear pedido
    const pedido = await Order.create({
      userId: req.user._id,
      items: itemsProcesados,
      total: totalPedido,
      estado: 'pendiente',
      metodoPago: metodoPago || 'mercadopago',
      direccionEnvio,
      notasCliente
    });

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: pedido
    });

  } catch (error) {
    console.error('Error al crear pedido:', error);
    // NOTA: Si esto falla, el stock ya se redujo.
    // Es el riesgo de no usar transacciones.
    res.status(500).json({ 
      error: 'Error al crear pedido',
      detalles: error.message 
    });
  }
};

// @desc    Obtener pedidos del usuario autenticado
// @route   GET /api/orders/mis-pedidos
// @access  Privado
export const obtenerMisPedidos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pedidos = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('userId', 'nombre email')
      .lean();

    const total = await Order.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      data: pedidos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ 
      error: 'Error al obtener pedidos',
      detalles: error.message 
    });
  }
};

// @desc    Obtener un pedido por ID
// @route   GET /api/orders/:id
// @access  Privado
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const pedido = await Order.findById(req.params.id)
      .populate('userId', 'nombre email telefono')
      .populate('items.productId', 'nombre marca imagenes');

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Verificar que el pedido pertenezca al usuario o sea admin
    if (pedido.userId._id.toString() !== req.user._id.toString() && 
        req.user.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'No tienes permiso para ver este pedido' 
      });
    }

    res.json({
      success: true,
      data: pedido
    });

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ 
      error: 'Error al obtener pedido',
      detalles: error.message 
    });
  }
};

// @desc    Obtener todos los pedidos (Admin)
// @route   GET /api/orders
// @access  Privado/Admin
export const obtenerTodosPedidos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Filtros opcionales
    const filtros = {};
    
    if (req.query.estado) {
      filtros.estado = req.query.estado;
    }

    if (req.query.fechaDesde) {
      filtros.createdAt = { 
        $gte: new Date(req.query.fechaDesde) 
      };
    }

    if (req.query.fechaHasta) {
      filtros.createdAt = { 
        ...filtros.createdAt,
        $lte: new Date(req.query.fechaHasta) 
      };
    }

    const pedidos = await Order.find(filtros)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('userId', 'nombre email telefono')
      .lean();

    const total = await Order.countDocuments(filtros);

    // Calcular estadísticas
    const stats = await Order.aggregate([
      { $match: filtros },
      {
        $group: {
          _id: null,
          totalVentas: { $sum: '$total' },
          pedidosPendientes: {
            $sum: { $cond: [{ $eq: ['$estado', 'pendiente'] }, 1, 0] }
          },
          pedidosPagados: {
            $sum: { $cond: [{ $eq: ['$estado', 'pagado'] }, 1, 0] }
          },
          pedidosEnviados: {
            $sum: { $cond: [{ $eq: ['$estado', 'enviado'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: pedidos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || {
        totalVentas: 0,
        pedidosPendientes: 0,
        pedidosPagados: 0,
        pedidosEnviados: 0
      }
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ 
      error: 'Error al obtener pedidos',
      detalles: error.message 
    });
  }
};

// @desc    Actualizar estado del pedido (Admin)
// @route   PATCH /api/orders/:id/estado
// @access  Privado/Admin
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'pagado', 'procesando', 'enviado', 'entregado', 'cancelado'];
    
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        error: 'Estado inválido. Estados permitidos: ' + estadosValidos.join(', ')
      });
    }

    const pedido = await Order.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    pedido.estado = estado;
    await pedido.save();

    res.json({
      success: true,
      message: 'Estado del pedido actualizado exitosamente',
      data: {
        id: pedido._id,
        estado: pedido.estado,
        fechaActualizacion: pedido.updatedAt
      }
    });

  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ 
      error: 'Error al actualizar estado del pedido',
      detalles: error.message 
    });
  }
};

// @desc    Cancelar pedido
// @route   DELETE /api/orders/:id
// @access  Privado
export const cancelarPedido = async (req, res) => {
  // --- VERSIÓN SIN TRANSACCIÓN (Compatible con M0) ---
  try {
    const pedido = await Order.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Verificar propiedad del pedido
    if (pedido.userId.toString() !== req.user._id.toString() && 
        req.user.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'No tienes permiso para cancelar este pedido' 
      });
    }

    // Solo permitir cancelar si está pendiente
    if (pedido.estado !== 'pendiente') {
      return res.status(400).json({ 
        error: 'Solo se pueden cancelar pedidos pendientes' 
      });
    }

    // Devolver stock a los productos
    for (const item of pedido.items) {
      const producto = await Product.findById(item.productId);
      if (producto) {
        producto.stock += item.cantidad;
        producto.ventas -= item.cantidad;
        await producto.save();
      }
    }

    pedido.estado = 'cancelado';
    await pedido.save();

    res.json({
      success: true,
      message: 'Pedido cancelado exitosamente'
    });

  } catch (error) {
    console.error('Error al cancelar pedido:', error);
    res.status(500).json({ 
      error: 'Error al cancelar pedido',
      detalles: error.message 
    });
  }
};

// @desc    Obtener estadísticas de ventas (Admin)
// @route   GET /api/orders/stats/ventas
// @access  Privado/Admin
export const obtenerEstadisticasVentas = async (req, res) => {
  try {
    const { periodo } = req.query; // 'dia', 'semana', 'mes', 'año'

    let fechaInicio = new Date();
    
    switch (periodo) {
      case 'dia':
        fechaInicio.setHours(0, 0, 0, 0);
        break;
      case 'semana':
        fechaInicio.setDate(fechaInicio.getDate() - 7);
        break;
      case 'mes':
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
        break;
      case 'año':
        fechaInicio.setFullYear(fechaInicio.getFullYear() - 1);
        break;
      default:
        fechaInicio.setMonth(fechaInicio.getMonth() - 1); // Default: último mes
    }

    const estadisticas = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fechaInicio },
          estado: { $in: ['pagado', 'procesando', 'enviado', 'entregado'] }
        }
      },
      {
        $group: {
          _id: null,
          totalPedidos: { $sum: 1 },
          totalIngresos: { $sum: '$total' },
          promedioTicket: { $avg: '$total' },
          productosMasVendidos: { $push: '$items' }
        }
      }
    ]);

    // Top 5 productos más vendidos
    const topProductos = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fechaInicio },
          estado: { $in: ['pagado', 'procesando', 'enviado', 'entregado'] }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          nombre: { $first: '$items.nombre' },
          totalVendido: { $sum: '$items.cantidad' },
          ingresos: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalVendido: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        periodo: periodo || 'mes',
        fechaInicio,
        resumen: estadisticas[0] || {
          totalPedidos: 0,
          totalIngresos: 0,
          promedioTicket: 0
        },
        topProductos
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas',
      detalles: error.message 
    });
  }
};

// @desc    Eliminar pedido
// @route   DELETE /api/orders/:id
// @access  Privado/Admin
export const eliminarPedido = async (req, res) => {
  try {
    const pedido = await Order.findById(req.params.id);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    await pedido.deleteOne();

    console.log('✅ Pedido eliminado:', req.params.id);

    res.json({
      success: true,
      message: 'Pedido eliminado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al eliminar pedido:', error);
    res.status(500).json({ 
      error: 'Error al eliminar pedido',
      detalles: error.message 
    });
  }
};
