import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  marca: {
    type: String,
    required: [true, 'La marca es obligatoria'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  volumen: {
    type: String,
    required: [true, 'El volumen es obligatorio'],
    enum: ['2ml', '5ml', '10ml', '15ml', '20ml']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  imagenes: [{
    type: String,
    required: true
  }],
  categoria: {
    type: String,
    required: true,
    enum: ['primavera', 'verano', 'otoño', 'invierno'],
    lowercase: true,
  },

  genero: {
    type: String,
    enum: ['masculino', 'femenino', 'unisex'],
    default: 'unisex'
  },
  activo: {
    type: Boolean,
    default: true
  },
  ventas: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

productSchema.index({ nombre: 'text', marca: 'text', descripcion: 'text' });
productSchema.index({ categoria: 1, genero: 1 });
productSchema.index({ precio: 1 });
productSchema.index({ activo: 1 });

productSchema.methods.estaDisponible = function(cantidad = 1) {
  return this.activo && this.stock >= cantidad;
};

productSchema.methods.reducirStock = async function(cantidad) {
  if (this.stock < cantidad) {
    throw new Error('Stock insuficiente');
  }
  this.stock -= cantidad;
  this.ventas += cantidad;
  await this.save();
};

const Product = mongoose.model('Product', productSchema);

export default Product;