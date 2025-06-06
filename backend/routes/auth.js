import express from 'express';
import bcrypt from 'bcrypt';
import connectToDatabase from '../database/connectionMySQL.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log('Recibida petición de login:', req.body);
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    console.log('Faltan credenciales:', { correo: !!correo, contraseña: !!contraseña });
    return res.status(400).json({ error: 'Se requiere correo y contraseña' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    console.log('Conexión a base de datos establecida');
    console.log('Buscando usuario con correo:', correo);

    const [users] = await connection.execute(
      'SELECT id_usuario, nombre_usuario, apellido_usuario, correo_electronico_usuario, contrasenia_usuario, rol_usuario FROM usuario WHERE correo_electronico_usuario = ?',
      [correo]
    );

    console.log('Resultado de la búsqueda:', { usuariosEncontrados: users.length });

    if (users.length === 0) {
      console.log('Usuario no encontrado:', correo);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = users[0];
    console.log('Verificando contraseña para usuario:', user.correo_electronico_usuario);

    const validPassword = await bcrypt.compare(contraseña, user.contrasenia_usuario);
    console.log('Resultado de verificación de contraseña:', validPassword);

    if (!validPassword) {
      console.log('Contraseña inválida para usuario:', correo);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Establecer la sesión
    req.session.userId = user.id_usuario;
    req.session.userRole = user.rol_usuario;

    console.log('Login exitoso para:', correo, 'con rol:', user.rol_usuario);
    
    // Cerrar la conexión antes de enviar la respuesta
    await connection.end();
    console.log('Conexión a base de datos cerrada');

    res.json({
      id: user.id_usuario,
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
  if (req.session.userId) {
    res.json({
      authenticated: true,
      userId: req.session.userId,
      rol: req.session.userRole
    });
  } else {
    res.status(401).json({ authenticated: false });
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

export default router; 