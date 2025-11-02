import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  eliminarImagenProducto,
  actualizarStock
} from '../controllers/productController.js';
import { proteger, admin } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// Rutas privadas (solo admin)
router.post('/', proteger, admin, upload.array('imagenes', 5), crearProducto);
router.put('/:id', proteger, admin, upload.array('imagenes', 5), actualizarProducto);
router.delete('/:id', proteger, admin, eliminarProducto);
router.delete('/:id/imagen/:index', proteger, admin, eliminarImagenProducto);
router.patch('/:id/stock', proteger, admin, actualizarStock);

export default router;
