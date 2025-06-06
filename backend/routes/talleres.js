import express from 'express';
import connectToDatabase from '../database/connectionMySQL.js';

const router = express.Router();

router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    console.log('Consultando talleres...');
    
    const [rows] = await connection.execute(
      'SELECT id_taller, nombre_taller, direccion_taller FROM taller'
    );
    
    console.log('Talleres encontrados:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener talleres:', error);
    res.status(500).json({ 
      error: 'Error al obtener los talleres',
      details: error.message 
    });
  }
});

// Obtener talleres por ID de usuario
router.get('/usuario/:userId', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
      'SELECT * FROM taller WHERE id_usuario = ?',
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener talleres:', error);
    res.status(500).json({ 
      error: 'Error al obtener talleres',
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