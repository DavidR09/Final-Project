import express from 'express';
import connectToDatabase from './connectionMySQL.js';

const router = express.Router();

// Middleware para parsear JSON y form data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ruta POST para insertar usuarios
router.post('/insertar-usuario', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        
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
                contrasenia_usuario,
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
    }
});

export default router;