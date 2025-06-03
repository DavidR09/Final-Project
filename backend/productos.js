import express from 'express';
import connectToDatabase from './database/connectionMySQL.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`
      SELECT 
        nombre_pieza AS nombre,
        desde_anio_pieza AS desde_anio,
        hasta_anio_pieza AS hasta_anio,
        precio_pieza AS precio,
        cantidad_pieza AS cantidad,
        descripcion_pieza AS descripcion,
        imagen_pieza AS imagen,
        id_categoria_pieza AS categoria_id,
        id_repuesto AS repuesto_id,
        id_vehiculo AS vehiculo_id
      FROM pieza;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener productos');
  }
});

export default router;