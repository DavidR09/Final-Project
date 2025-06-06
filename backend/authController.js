/* global process */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import connectToDatabase from './database/connectionMySQL.js'; // Ajusta la ruta si es necesario

dotenv.config();

// Generador del token JWT
const generarToken = (usuario) => {
  const payload = {
    id: usuario.id_usuario,
    rol: usuario.rol_usuario
  };
  console.log('Generando token para:', payload);
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Controlador de login
export const login = async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const { correo_electronico_usuario, contrasenia_usuario } = req.body;

    console.log('Intento de login para:', correo_electronico_usuario);

    if (!correo_electronico_usuario || !contrasenia_usuario) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    const [rows] = await connection.execute(
      `SELECT id_usuario, contrasenia_usuario, rol_usuario, nombre_usuario 
       FROM usuario WHERE correo_electronico_usuario = ?`,
      [correo_electronico_usuario]
    );

    if (rows.length === 0) {
      console.log('Usuario no encontrado:', correo_electronico_usuario);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = rows[0];
    console.log('Usuario encontrado:', { 
      id: usuario.id_usuario, 
      rol: usuario.rol_usuario,
      nombre: usuario.nombre_usuario 
    });

    const contraseniaValida = await bcrypt.compare(
      contrasenia_usuario,
      usuario.contrasenia_usuario
    );

    if (!contraseniaValida) {
      console.log('Contraseña incorrecta para usuario:', correo_electronico_usuario);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    console.log('Login exitoso para:', {
      userId: usuario.id_usuario,
      rol: usuario.rol_usuario,
      nombre: usuario.nombre_usuario
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      userId: usuario.id_usuario,
      rol: usuario.rol_usuario,
      nombre: usuario.nombre_usuario
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error en el servidor', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Controlador para verificar autenticación
export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'No autenticado - No hay token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Check Auth - Usuario verificado:', {
      userId: decoded.id,
      rol: decoded.rol
    });
    
    res.json({
      userId: decoded.id,
      rol: decoded.rol
    });
  } catch (error) {
    console.error('Error en checkAuth:', error);
    res.status(401).json({ 
      error: 'Token inválido o expirado',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
