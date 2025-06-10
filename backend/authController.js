/* global process */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import connectToDatabase from './database/connectionMySQL.js'; // Ajusta la ruta si es necesario

dotenv.config();

// Verificar que JWT_SECRET esté configurado
if (!process.env.JWT_SECRET) {
  console.error('ADVERTENCIA: JWT_SECRET no está configurado en el archivo .env');
}

// Generador del token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id_usuario, rol: usuario.rol_usuario },
    process.env.JWT_SECRET || 'default_secret_key_not_secure',
    { expiresIn: '1d' }
  );
};

// Controlador de login
export const login = async (req, res) => {
  console.log('Iniciando proceso de login');
  try {
    const connection = await connectToDatabase();
    const { correo_electronico_usuario, contrasenia_usuario } = req.body;

    console.log('Datos recibidos:', { 
      correo: correo_electronico_usuario,
      passwordLength: contrasenia_usuario ? contrasenia_usuario.length : 0
    });

    if (!correo_electronico_usuario || !contrasenia_usuario) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    const [rows] = await connection.execute(
      `SELECT id_usuario, contrasenia_usuario, rol_usuario 
       FROM usuario WHERE correo_electronico_usuario = ?`,
      [correo_electronico_usuario]
    );

    console.log('Resultado de búsqueda:', { 
      encontrado: rows.length > 0,
      rol: rows[0]?.rol_usuario
    });

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Correo no encontrado' });
    }

    const usuario = rows[0];

    const contraseniaValida = await bcrypt.compare(
      contrasenia_usuario,
      usuario.contrasenia_usuario
    );

    console.log('Validación de contraseña:', { 
      valida: contraseniaValida
    });

    if (!contraseniaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = generarToken(usuario);

    console.log('Token generado:', { 
      tokenLength: token.length,
      userId: usuario.id_usuario,
      rol: usuario.rol_usuario
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
      domain: 'localhost'
    });

    console.log('Cookie establecida, enviando respuesta');

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      userId: usuario.id_usuario,
      rol: usuario.rol_usuario
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};

// Controlador para verificar autenticación
export const checkAuth = async (req, res) => {
  console.log('Iniciando verificación de autenticación');
  console.log('Cookies recibidas:', req.cookies);
  
  try {
    if (!req.cookies) {
      console.log('No hay objeto cookies en la petición');
      return res.status(401).json({ 
        error: 'No autenticado',
        message: 'No se encontraron cookies'
      });
    }

    const token = req.cookies.token;
    console.log('Token encontrado:', !!token);
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No autenticado',
        message: 'No se encontró el token en las cookies'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está configurado');
      return res.status(500).json({ 
        error: 'Error de configuración del servidor',
        message: 'JWT_SECRET no está configurado'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', { 
      userId: decoded.id,
      rol: decoded.rol
    });
    
    res.json({
      authenticated: true,
      userId: decoded.id,
      rol: decoded.rol
    });
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    res.status(401).json({ 
      error: 'Token inválido',
      message: error.message
    });
  }
};
