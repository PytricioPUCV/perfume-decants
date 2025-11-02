import express from 'express';
import {
  crearPreferenciaPago,
  webhookMercadoPago,
  verificarPago,
  simularPagoMock
} from '../controllers/paymentController.js';
import { proteger } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-preference', proteger, crearPreferenciaPago);
router.post('/webhook', webhookMercadoPago);
router.get('/verificar/:paymentId', proteger, verificarPago);
router.post('/mock-payment', proteger, simularPagoMock);

export default router;
