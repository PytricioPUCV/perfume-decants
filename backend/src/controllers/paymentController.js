import { MercadoPagoConfig, Preference } from 'mercadopago';
import Order from '../models/Order.js';

// Variable para activar/desactivar modo mock
const MOCK_MODE = true; // FORZADO - El .env no se carga a tiempo

console.log('🔧 PaymentController cargado - Modo Mock:', MOCK_MODE); // Debug

// @desc    Crear preferencia de pago en MercadoPago (con modo mock)
// @route   POST /api/payments/create-preference
// @access  Privado
export const crearPreferenciaPago = async (req, res) => {
  try {
    const { orderId } = req.body;

    const pedido = await Order.findById(orderId).populate('userId');

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    if (pedido.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'No tienes permiso para pagar este pedido' 
      });
    }

    if (pedido.estado !== 'pendiente') {
      return res.status(400).json({ 
        error: 'Este pedido ya no está disponible para pago' 
      });
    }

    // ============================================
    // MODO MOCK - Para desarrollo sin MercadoPago
    // ============================================
    if (MOCK_MODE) {
      console.log('🧪 MODO MOCK ACTIVADO - Simulando MercadoPago');
      
      const mockPreferenceId = `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      res.json({
        success: true,
        mock: true,
        message: 'Modo de prueba activado - MercadoPago simulado',
        data: {
          id: mockPreferenceId,
          init_point: `${frontendUrl}/pago/mock?preference=${mockPreferenceId}&order=${orderId}`,
          sandbox_init_point: `${frontendUrl}/pago/mock?preference=${mockPreferenceId}&order=${orderId}`
        }
      });
      return;
    }

    // ============================================
    // MODO REAL - MercadoPago
    // ============================================
    console.log('💳 Creando preferencia REAL en MercadoPago');
    
    const items = pedido.items.map(item => ({
      id: item.productId.toString(),
      title: item.nombre,
      description: `${item.nombre} - ${item.volumen}`,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: 'CLP'
    }));

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    const preference = new Preference(client);
    
    const preferenceData = {
      items: items,
      payer: {
        name: pedido.userId.nombre,
        email: pedido.userId.email
      },
      back_urls: {
        success: `${frontendUrl}/pago/exitoso`,
        failure: `${frontendUrl}/pago/fallido`,
        pending: `${frontendUrl}/pago/pendiente`
      },
      auto_return: 'approved',
      external_reference: orderId.toString(),
      notification_url: `${backendUrl}/api/payments/webhook`,
      statement_descriptor: 'PERFUME DECANTS',
      metadata: {
        order_id: orderId.toString(),
        user_id: pedido.userId._id.toString()
      }
    };

    const result = await preference.create({ body: preferenceData });

    res.json({
      success: true,
      data: {
        id: result.id,
        init_point: result.sandbox_init_point || result.init_point,
        sandbox_init_point: result.sandbox_init_point
      }
    });

  } catch (error) {
    console.error('❌ Error al crear preferencia:', error.message);
    
    res.status(500).json({ 
      error: 'Error al procesar el pago',
      detalles: error.message,
      sugerencia: 'Activa MOCK_MODE en el .env para desarrollo sin MercadoPago',
      ...(process.env.NODE_ENV === 'development' && { 
        errorCompleto: error.response?.data || error 
      })
    });
  }
};

// @desc    Simular pago exitoso (solo en modo mock)
// @route   POST /api/payments/mock-payment
// @access  Privado
export const simularPagoMock = async (req, res) => {
  try {
    const { orderId, estado } = req.body;

    if (!MOCK_MODE) {
      return res.status(403).json({ 
        error: 'Modo mock no está activado' 
      });
    }

    const pedido = await Order.findById(orderId);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Simular diferentes estados de pago
    const estadoPedido = {
      'approved': 'pagado',
      'rejected': 'cancelado',
      'pending': 'pendiente'
    }[estado] || 'pendiente';

    pedido.estado = estadoPedido;
    pedido.pagoId = `mock-payment-${Date.now()}`;
    await pedido.save();

    console.log(`✅ Pago simulado: ${estado} -> Estado pedido: ${estadoPedido}`);

    res.json({
      success: true,
      message: `Pago simulado como ${estado}`,
      data: {
        orderId: pedido._id,
        estado: pedido.estado,
        pagoId: pedido.pagoId
      }
    });

  } catch (error) {
    console.error('Error al simular pago:', error);
    res.status(500).json({ 
      error: 'Error al simular pago',
      detalles: error.message 
    });
  }
};

// @desc    Webhook de MercadoPago para notificaciones de pago
// @route   POST /api/payments/webhook
// @access  Público
export const webhookMercadoPago = async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('📨 Webhook recibido:', { type, data });

    if (type === 'payment') {
      const paymentId = data.id;
      console.log('💰 Pago recibido:', paymentId);
    }

    res.sendStatus(200);

  } catch (error) {
    console.error('Error en webhook:', error);
    res.sendStatus(200);
  }
};

// @desc    Verificar estado de pago
// @route   GET /api/payments/verificar/:paymentId
// @access  Privado
export const verificarPago = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Función de verificación de pago'
    });

  } catch (error) {
    console.error('Error al verificar pago:', error);
    res.status(500).json({ 
      error: 'Error al verificar pago',
      detalles: error.message 
    });
  }
};
