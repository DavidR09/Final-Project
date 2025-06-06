import express from 'express';
import connectToDatabase from './database/connectionMySQL.js';

const router = express.Router();

// Ruta: GET /api/categorias
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    console.log('Obteniendo categorías...');
    
    const [rows] = await connection.execute(`
      SELECT 
        id_categoria_pieza,
        nombre_categoria_pieza,
        descripcion_categoria_pieza
      FROM categoria_pieza
      ORDER BY id_categoria_pieza;
    `);

    console.log('Categorías obtenidas:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).json({ 
      error: 'Error al obtener categorías',
      details: error.message 
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Conexión cerrada');
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

export default router;
