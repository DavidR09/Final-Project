const express = require('express');
const router = express.Router();
const authenticate = require('./authMiddleware');

// Ruta protegida
router.get('/datos-sensibles', authenticate, (req, res) => {
  res.json({ message: "Estos son datos protegidos" });
});

export default router;