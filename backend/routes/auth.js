import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../database/connectionMySQL.js';
//import cors from 'cors';

const router = express.Router();

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  console.log('Verificando token...');
  console.log('Cookies recibidas:', req.cookies);
  console.log('Headers recibidos:', req.headers);
  console.log('Cookie header:', req.headers.cookie);
  
  let token = req.cookies?.token;
  
  // Si no está en req.cookies, intentar extraerlo del header
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {});
    token = cookies.token;
    console.log('Token extraído del header:', token ? 'presente' : 'no encontrado');
  }
  
  if (!token) {
    console.log('No se encontró token en las cookies ni en los headers');
    return res.status(401).json({ 
      authenticated: false,
      error: 'No autenticado',
      message: 'No se encontró el token en las cookies'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(401).json({ 
      authenticated: false,
      error: 'Token inválido o expirado',
      message: error.message
    });
  }
};

router.post('/login', async (req, res) => {
  console.log('Recibida petición de login:', req.body);
  const { correo_electronico_usuario, contrasenia_usuario } = req.body;

  if (!correo_electronico_usuario || !contrasenia_usuario) {
    return res.status(400).json({ error: 'Se requiere email y contraseña' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    
    const [users] = await connection.execute(
      'SELECT id_usuario, nombre_usuario, apellido_usuario, correo_electronico_usuario, contrasenia_usuario, rol_usuario FROM usuario WHERE correo_electronico_usuario = ?',
      [correo_electronico_usuario]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(contrasenia_usuario, user.contrasenia_usuario);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id_usuario, 
        rol: user.rol_usuario 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Configurar la cookie para desarrollo local
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
      path: '/',
      domain: 'localhost'
    });

    console.log('Cookie establecida:', {
      token: token.substring(0, 20) + '...',
      options: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
        domain: 'localhost'
      }
    });
    
    res.json({
      userId: user.id_usuario,
      nombre: user.nombre_usuario,
      apellido: user.apellido_usuario,
      correo: user.correo_electronico_usuario,
      rol: user.rol_usuario
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error al procesar el login',
      details: error.message
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

router.get('/check-auth', verifyToken, (req, res) => {
  console.log('Usuario autenticado:', req.user);
  res.json({
    authenticated: true,
    userId: req.user.id,
    rol: req.user.rol
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    domain: 'localhost'
  });
  res.json({ message: 'Sesión cerrada exitosamente' });
});

// Nueva ruta para obtener datos del usuario
router.get('/usuario/:id', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id != req.params.id) {
      return res.status(403).json({ error: 'No autorizado para acceder a estos datos' });
    }

    let connection;
    try {
      connection = await connectToDatabase();
      console.log('Conexión a base de datos establecida');
      
      const [users] = await connection.execute(
        'SELECT id_usuario, nombre_usuario, apellido_usuario, correo_electronico_usuario, telefono_usuario FROM usuario WHERE id_usuario = ?',
        [req.params.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const user = users[0];
      res.json({ 
        success: true,
        usuario: user
      });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } catch (error) {
    console.error('Error al verificar token o obtener datos:', error);
    res.status(401).json({ error: 'Token inválido o error al obtener datos' });
  }
});

// Nueva ruta para actualizar datos del usuario
router.put('/usuario/:id', async (req, res) => {
  const userId = req.params.id;
  
  // Verificar que el usuario está autenticado y es el mismo que solicita la actualización
  if (!req.session.userId || req.session.userId != userId) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { nombre_usuario, apellido_usuario, correo_electronico_usuario, contrasenia_usuario, telefono_usuario } = req.body;
  let connection;

  try {
    connection = await connectToDatabase();

    // Si se proporciona una nueva contraseña, hashearla
    if (contrasenia_usuario) {
      const hashedPassword = await bcrypt.hash(contrasenia_usuario, 10);
      await connection.execute(
        `UPDATE usuario SET 
         nombre_usuario = ?, 
         apellido_usuario = ?, 
         correo_electronico_usuario = ?, 
         contrasenia_usuario = ?,
         telefono_usuario = ?
         WHERE id_usuario = ?`,
        [nombre_usuario, apellido_usuario, correo_electronico_usuario, hashedPassword, telefono_usuario, userId]
      );
    } else {
      // Si no hay nueva contraseña, actualizar todo excepto la contraseña
      await connection.execute(
        `UPDATE usuario SET 
         nombre_usuario = ?, 
         apellido_usuario = ?, 
         correo_electronico_usuario = ?, 
         telefono_usuario = ?
         WHERE id_usuario = ?`,
        [nombre_usuario, apellido_usuario, correo_electronico_usuario, telefono_usuario, userId]
      );
    }

    res.json({ message: 'Datos del usuario actualizados exitosamente' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

export default router;