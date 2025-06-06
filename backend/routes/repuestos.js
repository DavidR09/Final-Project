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

export default router; 