import express from 'express';
import login from '../authController.js'; // Ajusta la ruta según tu estructura

const router = express.Router();

// Middleware para parsear JSON y URL-encoded
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ruta de login
router.post('/login', login);

// Ruta de prueba
router.get('/login/test', (req, res) => {
  res.json({ message: 'Ruta /api/login/test funcionando correctamente' });
});

export default router;