import express from 'express';
import connectToDatabase from './database/connectionMySQL.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`
      SELECT 
        nombre_pieza, 
        desde_anio_pieza, 
        hasta_anio_pieza, 
        precio_pieza, 
        cantidad_pieza, 
        descripcion_pieza, 
        imagen_pieza,
        id_categoria_pieza, 
        id_repuesto, 
        id_vehiculo 
      FROM pieza;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener productos');
  }
});

export default router;