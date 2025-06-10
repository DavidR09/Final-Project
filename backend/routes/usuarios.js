import express from 'express';
import connectToDatabase from '../database/connectionMySQL.js';

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

export default router; 