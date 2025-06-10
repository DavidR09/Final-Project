import express from 'express';
import connectToDatabase from '../database/connectionMySQL.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    
    const [usuarios] = await connection.execute(`
      SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.apellido_usuario,
        u.correo_electronico_usuario,
        u.telefono_usuario,
        u.rol_usuario,
        u.fecha_registro_usuario,
        t.nombre_taller,
        t.direccion_taller
      FROM usuario u
      LEFT JOIN taller t ON u.id_usuario = t.id_usuario
      ORDER BY u.fecha_registro_usuario DESC
    `);

    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      error: 'Error al obtener los usuarios',
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

// Ruta POST para insertar usuarios
router.post('/insertar-usuario', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    
    // Extraer datos del cuerpo de la solicitud
    const {
      nombre_usuario,
      apellido_usuario,
      correo_electronico_usuario,
      contrasenia_usuario,
      rol_usuario,
      telefono_usuario
    } = req.body;

    // Validación básica
    if (!nombre_usuario || !apellido_usuario || !correo_electronico_usuario || 
        !contrasenia_usuario || !rol_usuario || !telefono_usuario) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el correo ya existe
    const [existingUsers] = await connection.execute(
      'SELECT id_usuario FROM usuario WHERE correo_electronico_usuario = ?',
      [correo_electronico_usuario]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(contrasenia_usuario, 10);

    // Ejecutar la consulta SQL
    const [results] = await connection.execute(
      `INSERT INTO usuario 
      (nombre_usuario, apellido_usuario, correo_electronico_usuario, 
       contrasenia_usuario, rol_usuario, telefono_usuario) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre_usuario,
        apellido_usuario,
        correo_electronico_usuario,
        hashedPassword,
        rol_usuario,
        telefono_usuario
      ]
    );

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      userId: results.insertId
    });

  } catch (error) {
    console.error('Error al insertar usuario:', error);
    res.status(500).json({ 
      error: 'Error al registrar usuario',
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