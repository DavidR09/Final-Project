import express from 'express';
import cors from 'cors';
import session from 'express-session';
import stripeRoutes from './routes/stripe.js';
import talleresRoutes from './routes/talleres.js';
import pedidosRoutes from './routes/pedidos.js';
import authRoutes from './routes/auth.js';
import categoriasRoutes from './categoriasRoute.js';
import productosRoutes from './productos.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(session({
  secret: 'tu_secreto_aqui',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Rutas de autenticación
app.use('/api', authRoutes);

// Rutas de Stripe
app.use('/api/stripe', stripeRoutes);

// Rutas de talleres
app.use('/api/talleres', talleresRoutes);

// Rutas de pedidos
app.use('/api/pedidos', pedidosRoutes);

// Rutas de categorías
app.use('/api/categorias', categoriasRoutes);

// Rutas de productos
app.use('/api/productos', productosRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 