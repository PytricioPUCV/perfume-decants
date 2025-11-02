import express from 'express';
import {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  actualizarPerfil
} from '../controllers/authController.js';
import { proteger } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/register', registrarUsuario);
router.post('/login', iniciarSesion);

// Rutas privadas (requieren autenticación)
router.get('/perfil', proteger, obtenerPerfil);
router.put('/perfil', proteger, actualizarPerfil);

export default router;
