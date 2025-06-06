import express from 'express';
import connectToDatabase from './database/connectionMySQL.js';

const router = express.Router();

// Ruta para obtener productos
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    console.log('Obteniendo productos...');
    
    const [rows] = await connection.execute(`
      SELECT 
        p.id_repuesto,
        p.nombre_pieza,
        p.desde_anio_pieza,
        p.hasta_anio_pieza,
        p.precio_pieza,
        p.cantidad_pieza,
        p.descripcion_pieza,
        p.imagen_pieza,
        p.id_categoria_pieza,
        p.id_vehiculo,
        c.nombre_categoria_pieza,
        c.descripcion_categoria_pieza
      FROM pieza p
      LEFT JOIN categoria_pieza c ON p.id_categoria_pieza = c.id_categoria_pieza
      ORDER BY p.id_repuesto;
    `);

    console.log('Productos obtenidos:', rows.length);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      error: 'Error al obtener productos',
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