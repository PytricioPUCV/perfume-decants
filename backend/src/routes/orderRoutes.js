import express from 'express';
import {
  crearPedido,
  obtenerMisPedidos,
  obtenerPedidoPorId,
  obtenerTodosPedidos,
  actualizarEstadoPedido,
  cancelarPedido,
  obtenerEstadisticasVentas,
  eliminarPedido  
} from '../controllers/orderController.js';
import { proteger, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de cliente
router.post('/', proteger, crearPedido);
router.get('/mis-pedidos', proteger, obtenerMisPedidos);
router.get('/:id', proteger, obtenerPedidoPorId);
router.delete('/:id', proteger, cancelarPedido);

// Rutas de admin
router.get('/', proteger, admin, obtenerTodosPedidos);
router.patch('/:id/estado', proteger, admin, actualizarEstadoPedido);
router.get('/stats/ventas', proteger, admin, obtenerEstadisticasVentas);
router.delete('/:id', proteger, admin, eliminarPedido);

export default router;
