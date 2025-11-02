import mongoose from 'mongoose';
import Product from '../src/models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Mapeo de categorías antiguas a nuevas
    const categoryMap = {
      'fresco': 'verano',
      'amaderado': 'otoño',
      'floral': 'primavera',
      'oriental': 'invierno',
      'cítrico': 'verano',
      'especiado': 'invierno',
      'gourmand': 'otoño'
    };

    const products = await Product.find({});
    
    for (const product of products) {
      const newCategory = categoryMap[product.categoria] || 'primavera';
      
      await Product.findByIdAndUpdate(product._id, {
        categoria: newCategory
      });
      
      console.log(`Actualizado: ${product.nombre} -> ${newCategory}`);
    }

    console.log('✅ Migración completada');
    process.exit(0);
  } catch (error) {
    console.error('Error en migración:', error);
    process.exit(1);
  }
};

migrateCategories();
