import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
    });

    console.log(`MongoDB Conectado: ${conn.connection.host}`);
    
    mongoose.connection.on('error', (err) => {
      console.error('Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB desconectado');
    });

  } catch (error) {
    console.error(`Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;