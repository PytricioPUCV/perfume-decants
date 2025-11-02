// ========================================
// 1. CARGAR DOTENV PRIMERO
// ========================================
import dotenv from 'dotenv';
dotenv.config();

// ========================================
// 2. IMPORTS BÁSICOS
// ========================================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from '@exortek/express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// ========================================
// 3. IMPORTS DE CONFIGURACIÓN Y RUTAS
// ========================================
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// ========================================
// 4. CONFIGURACIÓN INICIAL
// ========================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar a MongoDB
connectDB();

const app = express();

// ========================================
// 5. MIDDLEWARE DE SEGURIDAD
// ========================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde'
});
// COMENTADO POR AHORA (descomenta después en producción)
// app.use('/api', limiter);

// ========================================
// 6. BODY PARSERS
// ========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(mongoSanitize({
  replaceWith: '_'
}));

// ========================================
// 7. ARCHIVOS ESTÁTICOS
// ========================================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ========================================
// 8. RUTAS DE SALUD
// ========================================
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API de Perfume Decants está funcionando',
    version: '1.0.0',
    mockMode: process.env.MERCADOPAGO_MOCK_MODE === 'true',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    mongodb: 'Connected',
    mockMode: process.env.MERCADOPAGO_MOCK_MODE === 'true',
    uptime: process.uptime()
  });
});

// ========================================
// 9. RUTAS DE LA API
// ========================================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

console.log('📍 Rutas registradas:');
console.log('   ✓ /api/auth');
console.log('   ✓ /api/products');
console.log('   ✓ /api/orders');
console.log('   ✓ /api/payments');

// ========================================
// 10. MANEJO DE ERRORES
// ========================================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl 
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========================================
// 11. INICIAR SERVIDOR
// ========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📱 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🧪 Modo Mock: ${process.env.MERCADOPAGO_MOCK_MODE === 'true' ? 'ACTIVADO' : 'DESACTIVADO'}`);
});