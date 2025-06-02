import express from 'express';
import authenticate from './authMiddleware.js'; // Asegúrate de tener la extensión .js

const router = express.Router();

// Ruta protegida
router.get('/datos-sensibles', authenticate, (req, res) => {
  res.json({ message: "Estos son datos protegidos" });
});

export default router;