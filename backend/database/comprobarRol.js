import express from 'express';
import { login, checkAuth } from '../authController.js';
import { authenticate } from '../authMiddleware.js';

const router = express.Router();

// Middleware para parsear JSON y URL-encoded
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ruta de login
router.post('/login', login);

// Ruta para verificar autenticación
router.get('/check-auth', checkAuth);

// Ruta de prueba
router.get('/login/test', (req, res) => {
  res.json({ message: 'Ruta /api/login/test funcionando correctamente' });
});

export default router;