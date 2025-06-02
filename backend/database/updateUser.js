import express from 'express';
import connectToDatabase from 'connectionMySQL.js';

const router = express.Router();

// Middleware para parsear JSON y form data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ruta PUT para actualizar usuarios
router.put('/actualizar-usuario/:id', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        
        // Extraer datos del cuerpo de la solicitud y el ID de los parámetros
        const userId = req.params.id;
        const {
            nombre_usuario,
            apellido_usuario,
            correo_electronico_usuario,
            contrasenia_usuario,
            telefono_usuario
        } = req.body;

        // Validación básica
        if (!userId) {
            return res.status(400).json({ error: 'Se requiere el ID del usuario' });
        }

        if (!nombre_usuario || !apellido_usuario || !correo_electronico_usuario || 
            !contrasenia_usuario || !telefono_usuario) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Ejecutar la consulta SQL de actualización
        const [results] = await connection.execute(
            `UPDATE usuario 
            SET nombre_usuario = ?,
                apellido_usuario = ?,
                correo_electronico_usuario = ?,
                contrasenia_usuario = ?,
                telefono_usuario = ?
            WHERE id_usuario = ?`,
            [
                nombre_usuario,
                apellido_usuario,
                correo_electronico_usuario,
                contrasenia_usuario,
                telefono_usuario,
                userId
            ]
        );

        // Verificar si se actualizó algún registro
        if (results.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Usuario no encontrado',
                message: 'No se encontró ningún usuario con el ID proporcionado' 
            });
        }

        // Respuesta exitosa
        res.status(200).json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            userId: userId
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ 
            error: 'Error al actualizar usuario',
            details: error.message 
        });
    }
});

export default router;