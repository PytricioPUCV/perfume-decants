import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Proteger rutas - verificar JWT
export const proteger = async (req, res, next) => {
  let token;

  // Verificar si el token existe en el header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extraer token del header "Bearer TOKEN"
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token (sin incluir password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ 
          error: 'Usuario no encontrado' 
        });
      }

      // Actualizar último acceso
      req.user.ultimoAcceso = Date.now();
      // await req.user.save();

      next();
    } catch (error) {
      console.error('Error en autenticación:', error.message);
      
      // Diferenciar entre token expirado y token inválido
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expirado, por favor inicia sesión nuevamente' 
        });
      }
      
      return res.status(401).json({ 
        error: 'Token inválido, autorización denegada' 
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      error: 'No autorizado, token no encontrado' 
    });
  }
};

// Middleware para verificar rol de administrador
export const admin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      error: 'Acceso denegado: Se requieren permisos de administrador' 
    });
  }
};