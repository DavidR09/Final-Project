import express from 'express';
import bcrypt from 'bcrypt';
import connectToDatabase from '../database/connectionMySQL.js';
//import cors from 'cors';

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log('Recibida petición de login:', req.body);
  const { correo_electronico_usuario, contrasenia_usuario } = req.body;
  console.log('Email recibido:', correo_electronico_usuario);
  console.log('Password recibido:', contrasenia_usuario);

  if (!correo_electronico_usuario || !contrasenia_usuario) {
    console.log('Faltan credenciales:', { email: !!correo_electronico_usuario, password: !!contrasenia_usuario });
    return res.status(400).json({ error: 'Se requiere email y contraseña' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    console.log('Conexión a base de datos establecida');
    console.log('Buscando usuario con email:', correo_electronico_usuario);

    const [users] = await connection.execute(
      'SELECT id_usuario, nombre_usuario, apellido_usuario, correo_electronico_usuario, contrasenia_usuario, rol_usuario FROM usuario WHERE correo_electronico_usuario = ?',
      [correo_electronico_usuario]
    );

    console.log('Resultado de la búsqueda:', { usuariosEncontrados: users.length });

    if (users.length === 0) {
      console.log('Usuario no encontrado:', correo_electronico_usuario);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];
    console.log('Verificando contraseña para usuario:', user.correo_electronico_usuario);

    const validPassword = await bcrypt.compare(contrasenia_usuario, user.contrasenia_usuario);
    console.log('Resultado de verificación de contraseña:', validPassword);

    if (!validPassword) {
      console.log('Contraseña inválida para usuario:', correo_electronico_usuario);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Establecer la sesión
    req.session.userId = user.id_usuario;
    req.session.userRole = user.rol_usuario;
    console.log('Session antes de enviar respuesta:', req.session);

    console.log('Login exitoso para:', correo_electronico_usuario, 'con rol:', user.rol_usuario);
    
    res.json({
      userId: user.id_usuario,
      nombre: user.nombre_usuario,
      apellido: user.apellido_usuario,
      correo: user.correo_electronico_usuario,
      rol: user.rol_usuario
    });
  } catch (error) {
    console.error('Error detallado en login:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      error: 'Error al procesar el login',
      details: error.message,
      sqlMessage: error.sqlMessage 
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Conexión a base de datos cerrada');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

router.get('/check-auth', (req, res) => {
  console.log('Verificando autenticación - Session:', req.session);
  
  if (req.session && req.session.userId && req.session.userRole) {
    console.log('Usuario autenticado:', {
      userId: req.session.userId,
      rol: req.session.userRole
    });
    
    res.json({
      authenticated: true,
      userId: req.session.userId,
      rol: req.session.userRole
    });
  } else {
    console.log('Usuario no autenticado - Session:', req.session);
    res.status(401).json({ 
      authenticated: false,
      error: 'No autenticado'
    });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.json({ message: 'Sesión cerrada exitosamente' });
  });
});

// Nueva ruta para obtener datos del usuario
router.get('/usuario/:id', async (req, res) => {
  console.log('GET /usuario/:id - Recibida petición para ID:', req.params.id);
  console.log('Session:', req.session);
  
  const userId = req.params.id;
  
  // Verificar que el usuario está autenticado y es el mismo que solicita los datos
  if (!req.session.userId || req.session.userId != userId) {
    console.log('Autenticación fallida:', {
      sessionUserId: req.session.userId,
      requestedId: userId
    });
    return res.status(401).json({ error: 'No autorizado' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    console.log('Conexión a base de datos establecida');
    
    const [users] = await connection.execute(
      'SELECT id_usuario, nombre_usuario, apellido_usuario, correo_electronico_usuario, telefono_usuario FROM usuario WHERE id_usuario = ?',
      [userId]
    );

    console.log('Resultado de la consulta:', users);

    if (users.length === 0) {
      console.log('Usuario no encontrado para ID:', userId);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];
    console.log('Enviando datos del usuario:', { ...user, contrasenia_usuario: '[REDACTED]' });
    
    // Asegurarse de que la respuesta tenga el header correcto
    res.setHeader('Content-Type', 'application/json');
    return res.json({ 
      success: true,
      usuario: user
    });
  } catch (error) {
    console.error('Error detallado al obtener datos del usuario:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
    
    // Asegurarse de que la respuesta de error tenga el header correcto
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ 
      error: 'Error al obtener datos del usuario',
      details: error.message
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Conexión a base de datos cerrada');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
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

    res.json({ 
      success: true,
      message: 'Perfil actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar datos del usuario:', error);
    res.status(500).json({ 
      error: 'Error al actualizar datos del usuario',
      details: error.message
    });
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

export default router; 