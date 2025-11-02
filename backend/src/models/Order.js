import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID de usuario es obligatorio']
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    volumen: { type: String, required: true },
    cantidad: { 
      type: Number, 
      required: true,
      min: [1, 'La cantidad debe ser al menos 1']
    },
    subtotal: { type: Number, required: true }
  }],
  total: {
    type: Number,
    required: [true, 'El total es obligatorio'],
    min: [0, 'El total no puede ser negativo']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'procesando', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  metodoPago: {
    type: String,
    enum: ['mercadopago', 'flow'],
    required: true
  },
  pagoId: {
    type: String,
    trim: true
  },
  direccionEnvio: {
    calle: { type: String, required: true, trim: true },
    ciudad: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    codigoPostal: { type: String, required: true, trim: true }
  },
  notasCliente: {
    type: String,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  }
}, {
  timestamps: true
});

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ estado: 1 });
orderSchema.index({ pagoId: 1 });

orderSchema.methods.calcularTotal = function() {
  this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  return this.total;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;