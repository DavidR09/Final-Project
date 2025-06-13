import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../database/connectionMySQL.js';
//import cors from 'cors';

const router = express.Router();

// Configuración común para cookies
const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000 // 24 horas
};

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  let token = null;
  // Buscar el token en el header Authorization
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ 
      authenticated: false,
      error: 'No autenticado',
      message: 'No se encontró el token en el header Authorization'
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      authenticated: false,
      error: 'Token inválido o expirado',
      message: error.message
    });
  }
};

router.post('/login', async (req, res) => {
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
    const responseData = {
      token,
      userId: user.id_usuario,
      nombre: user.nombre_usuario,
      apellido: user.apellido_usuario,
      correo: user.correo_electronico_usuario,
      rol: user.rol_usuario
    };
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {}
    }
  }
});

router.get('/check-auth', verifyToken, (req, res) => {
  res.json({
    authenticated: true,
    id: req.user.id,
    rol: req.user.rol
  });
});

router.post('/logout', (req, res) => {
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