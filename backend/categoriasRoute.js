import express from 'express';
import connectToDatabase from './database/connectionMySQL.js';

const router = express.Router();

// Ruta: GET /api/categorias
router.get('/', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`
      SELECT 
        nombre_categoria_pieza,
        descripcion_categoria_pieza
      FROM categoria_pieza;
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    res.status(500).send('Error al obtener categorías');
  }
});

export default router;
