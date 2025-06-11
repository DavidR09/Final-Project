import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../database/connectionMySQL.js';
//import cors from 'cors';

const router = express.Router();

// Configuración común para cookies
const cookieConfig = {
  httpOnly: true,
  secure: false, // Cambiar a true en producción
  sameSite: 'lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000 // 24 horas
};

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  console.log('=== Verificando token ===');
  console.log('Headers completos:', req.headers);
  console.log('Cookies parseadas:', req.cookies);
  
  // Intentar obtener el token de diferentes fuentes
  let token = null;
  
  // 1. Intentar obtener de req.cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('Token encontrado en req.cookies');
  }
  // 2. Intentar obtener del header cookie
  else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';')
      .map(cookie => cookie.trim().split('='))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    
    if (cookies.token) {
      token = cookies.token;
      console.log('Token encontrado en header cookie');
    }
  }
  // 3. Intentar obtener del header Authorization
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token encontrado en header Authorization');
  }

  if (!token) {
    console.log('No se encontró token en ninguna fuente');
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
    
    // Renovar la cookie en cada petición exitosa
    res.cookie('token', token, cookieConfig);
    
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.clearCookie('token', cookieConfig);
    res.status(401).json({ 
      authenticated: false,
      error: 'Token inválido o expirado',
      message: error.message
    });
  }
};

router.post('/login', async (req, res) => {
  console.log('=== Inicio de proceso de login ===');
  console.log('Body recibido:', req.body);
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

    console.log('=== Configurando cookie ===');
    console.log('Token generado:', token.substring(0, 20) + '...');
    
    // Limpiar cualquier cookie anterior
    res.clearCookie('token', cookieConfig);
    
    // Configurar la nueva cookie
    res.cookie('token', token, cookieConfig);

    console.log('Cookie establecida con config:', cookieConfig);
    
    const responseData = {
      userId: user.id_usuario,
      nombre: user.nombre_usuario,
      apellido: user.apellido_usuario,
      correo: user.correo_electronico_usuario,
      rol: user.rol_usuario
    };

    console.log('Enviando respuesta:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

router.get('/check-auth', verifyToken, (req, res) => {
  console.log('=== Check Auth exitoso ===');
  console.log('Usuario autenticado:', req.user);
  res.json({
    authenticated: true,
    id: req.user.id,
    rol: req.user.rol
  });
});

router.post('/logout', (req, res) => {
  console.log('=== Cerrando sesión ===');
  res.clearCookie('token', cookieConfig);
  res.json({ message: 'Sesión cerrada exitosamente' });
});

// Ruta para obtener datos del usuario
router.get('/usuario/:id', verifyToken, async (req, res) => {
  console.log('=== Obteniendo datos de usuario ===');
  console.log('ID solicitado:', req.params.id);
  console.log('Usuario autenticado:', req.user);
  
  try {
    if (req.user.id != req.params.id) {
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
      console.log('Datos de usuario encontrados:', user);
      
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
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});

// Ruta para actualizar datos del usuario
router.put('/usuario/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.id != req.params.id) {
      return res.status(403).json({ error: 'No autorizado para modificar estos datos' });
    }

    const { nombre_usuario, apellido_usuario, correo_electronico_usuario, contrasenia_usuario, telefono_usuario } = req.body;
    let connection;

    try {
      connection = await connectToDatabase();

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
          [nombre_usuario, apellido_usuario, correo_electronico_usuario, hashedPassword, telefono_usuario, req.params.id]
        );
      } else {
        await connection.execute(
          `UPDATE usuario SET 
           nombre_usuario = ?, 
           apellido_usuario = ?, 
           correo_electronico_usuario = ?, 
           telefono_usuario = ?
           WHERE id_usuario = ?`,
          [nombre_usuario, apellido_usuario, correo_electronico_usuario, telefono_usuario, req.params.id]
        );
      }

      res.json({ 
        success: true,
        message: 'Datos del usuario actualizados exitosamente' 
      });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } catch (error) {
    console.error('Error al actualizar datos:', error);
    res.status(500).json({ error: 'Error al actualizar datos del usuario' });
  }
});

export default router;