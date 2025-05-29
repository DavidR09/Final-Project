import express from 'express';
import connectToDatabase from './connectionMySQL.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/login', async (req, res) => {
    try {
        const connection = await connectToDatabase();
        const { correo_electronico_usuario, contrasenia_usuario } = req.body;

        if (!correo_electronico_usuario || !contrasenia_usuario) {
            return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
        }

        const [rows] = await connection.execute(
            `SELECT id_usuario, contrasenia_usuario, rol_usuario 
             FROM usuario WHERE correo_electronico_usuario = ?`,
            [correo_electronico_usuario]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Correo no encontrado' });
        }

        const usuario = rows[0];

        // Aquí NO es necesario validar tipo, asumiendo que contrasenia_usuario es string
        const contraseniaValida = await bcrypt.compare(
            contrasenia_usuario,
            usuario.contrasenia_usuario
        );

        if (!contraseniaValida) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            userId: usuario.id_usuario,
            rol: usuario.rol_usuario
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor', details: error.message });
    }
});

router.get('/login/test', (req, res) => {
    res.json({ message: 'Ruta /api/login/test funcionando correctamente' });
});

export default router;
