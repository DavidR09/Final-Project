import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import stripeRoutes from './routes/stripe.js';
import talleresRoutes from './routes/talleres.js';
import pedidosRoutes from './routes/pedidos.js';
import authRoutes from './routes/auth.js';
import categoriasRoutes from './categoriasRoute.js';
import productosRoutes from './productos.js';
import repuestosRoutes from './routes/repuestos.js';
import usuariosRoutes from './routes/usuarios.js';

const app = express();

// Configuración de cookie-parser
app.use(cookieParser());

// Configuración de CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://backend-respuestosgra.up.railway.app',
    'https://respuestosgra.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept', 
    'Origin', 
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Credentials'
  ],
  exposedHeaders: ['Set-Cookie', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Middleware adicional para asegurar headers CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesión
app.use(session({
  secret: 'tu_secreto_aqui',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true en producción (https)
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

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

// Rutas de repuestos
app.use('/api/repuestos', repuestosRoutes);

// Rutas de usuarios
app.use('/api/usuarios', usuariosRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  console.log('Ruta no encontrada:', req.url);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
}); 