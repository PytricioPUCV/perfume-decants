import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Función auxiliar para generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Público
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar que todos los campos existan
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: 'Por favor completa todos los campos' 
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExiste = await User.findOne({ email: email.toLowerCase() });

    if (usuarioExiste) {
      return res.status(400).json({ 
        error: 'Este email ya está registrado' 
      });
    }

    // Crear usuario
    const usuario = await User.create({
      nombre,
      email: email.toLowerCase(),
      password
    });

    // Generar token
    const token = generarToken(usuario._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        token
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error al registrar usuario',
      detalles: error.message 
    });
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Público
export const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Por favor proporciona email y contraseña' 
      });
    }

    // Buscar usuario (incluir password porque select: false en el modelo)
    const usuario = await User.findOne({ email: email.toLowerCase() })
      .select('+password');

    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const passwordCorrecto = await usuario.compararPassword(password);

    if (!passwordCorrecto) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    // Actualizar último acceso
    await usuario.actualizarUltimoAcceso();

    // Generar token
    const token = generarToken(usuario._id);

    res.json({
      success: true,
      message: 'Sesión iniciada exitosamente',
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        token
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error al iniciar sesión',
      detalles: error.message 
    });
  }
};

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/perfil
// @access  Privado
export const obtenerPerfil = async (req, res) => {
  try {
    // req.user ya fue establecido por el middleware 'proteger'
    const usuario = await User.findById(req.user._id).select('-password');

    res.json({
      success: true,
      data: usuario
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      error: 'Error al obtener perfil',
      detalles: error.message 
    });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/auth/perfil
// @access  Privado
export const actualizarPerfil = async (req, res) => {
  try {
    const usuario = await User.findById(req.user._id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar campos permitidos
    usuario.nombre = req.body.nombre || usuario.nombre;
    usuario.telefono = req.body.telefono || usuario.telefono;
    
    if (req.body.direccion) {
      usuario.direccion = {
        ...usuario.direccion,
        ...req.body.direccion
      };
    }

    // Si se proporciona nueva contraseña
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ 
          error: 'La contraseña debe tener al menos 6 caracteres' 
        });
      }
      usuario.password = req.body.password;
    }

    const usuarioActualizado = await usuario.save();

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        id: usuarioActualizado._id,
        nombre: usuarioActualizado.nombre,
        email: usuarioActualizado.email,
        telefono: usuarioActualizado.telefono,
        direccion: usuarioActualizado.direccion,
        rol: usuarioActualizado.rol
      }
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      error: 'Error al actualizar perfil',
      detalles: error.message 
    });
  }
};