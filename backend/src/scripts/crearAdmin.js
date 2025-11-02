import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const crearAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('Conectado a MongoDB');

    // Verificar si ya existe un admin
    const adminExiste = await User.findOne({ email: 'admin@perfumedecants.com' });

    if (adminExiste) {
      console.log('⚠️  El usuario admin ya existe');
      process.exit(0);
    }

    // Crear admin
    const admin = await User.create({
      nombre: 'Administrador',
      email: 'admin@perfumedecants.com',
      password: 'Admin123!',
      rol: 'admin'
    });

    console.log('✅ Usuario administrador creado exitosamente');
    console.log('Email:', admin.email);
    console.log('Password: Admin123!');
    console.log('⚠️  CAMBIA ESTA CONTRASEÑA INMEDIATAMENTE');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

crearAdmin();
