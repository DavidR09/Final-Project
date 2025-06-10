import express from 'express';
import connectToDatabase from '../database/connectionMySQL.js';

const router = express.Router();

// Registrar nuevo repuesto
router.post('/registrar', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const { nombre_repuesto, direccion_repuesto, telefono_repuesto } = req.body;
    
    const [result] = await connection.execute(
      'INSERT INTO repuesto (nombre_repuesto, direccion_repuesto, telefono_repuesto) VALUES (?, ?, ?)',
      [nombre_repuesto, direccion_repuesto, telefono_repuesto]
    );
    
    res.status(201).json({ 
      message: 'Repuesto registrado exitosamente',
      id_repuesto: result.insertId 
    });
  } catch (error) {
    console.error('Error al registrar repuesto:', error);
    res.status(500).json({ 
      error: 'Error al registrar el repuesto',
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

// Obtener todos los repuestos
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
      'SELECT * FROM repuesto'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener repuestos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los repuestos',
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

// Obtener el stock de un repuesto específico
router.get('/stock/:id', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    console.log('Consultando stock para repuesto ID:', req.params.id);
    
    const [rows] = await connection.execute(
      'SELECT p.id_repuesto, p.nombre_pieza, p.cantidad_pieza FROM pieza p WHERE p.id_repuesto = ?',
      [req.params.id]
    );

    console.log('Resultado de la consulta:', rows);

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Repuesto no encontrado',
        id: req.params.id
      });
    }

    res.json({
      id_repuesto: parseInt(rows[0].id_repuesto),
      nombre_pieza: rows[0].nombre_pieza,
      cantidad_pieza: parseInt(rows[0].cantidad_pieza)
    });
  } catch (error) {
    console.error('Error al obtener stock del repuesto:', error);
    res.status(500).json({ 
      error: 'Error al obtener el stock del repuesto',
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

// Buscar repuesto por nombre
router.get('/buscar-por-nombre', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const nombre = req.query.nombre;

    if (!nombre) {
      return res.status(400).json({
        error: 'Debe proporcionar un nombre de repuesto'
      });
    }

    const [rows] = await connection.execute(
      'SELECT id_repuesto, nombre_pieza, cantidad_pieza FROM pieza WHERE nombre_pieza = ?',
      [nombre]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'Repuesto no encontrado',
        nombre: nombre
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al buscar repuesto por nombre:', error);
    res.status(500).json({ 
      error: 'Error al buscar el repuesto',
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

// Obtener repuestos con sus piezas asociadas
router.get('/con-piezas', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    
    // Primero obtenemos todos los repuestos
    const [repuestos] = await connection.execute(
      'SELECT * FROM repuesto ORDER BY nombre_repuesto'
    );

    // Para cada repuesto, obtenemos sus piezas asociadas
    for (let repuesto of repuestos) {
      const [piezas] = await connection.execute(
        `SELECT 
          p.id_repuesto,
          p.nombre_pieza,
          p.desde_anio_pieza,
          p.hasta_anio_pieza,
          p.precio_pieza,
          p.cantidad_pieza,
          p.descripcion_pieza,
          p.imagen_pieza,
          c.nombre_categoria_pieza
        FROM pieza p
        LEFT JOIN categoria_pieza c ON p.id_categoria_pieza = c.id_categoria_pieza
        WHERE p.id_repuesto = ?`,
        [repuesto.id_repuesto]
      );
      
      repuesto.piezas = piezas;
    }

    res.json(repuestos);
  } catch (error) {
    console.error('Error al obtener repuestos con piezas:', error);
    res.status(500).json({ 
      error: 'Error al obtener los repuestos con piezas',
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