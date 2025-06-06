/* global process */
import dotenv from 'dotenv';
dotenv.config();
console.log('DB_USER:', process.env.DB_USER);

import express from 'express';
import cookieParser from 'cookie-parser';
import connectToDatabase from './database/connectionMySQL.js';
import cors from 'cors';
import usuarioRouter from './database/insertUser.js';
import loginRouter from './database/comprobarRol.js';
import productosRouter from './productos.js';
import categoriasRoute from './categoriasRoute.js'; 
//import bodyParser from 'body-parser';
import session from 'express-session';

const app = express();
const port = 3000;

// Configuración para desarrollo local
console.log("Entorno: Desarrollo Local (Node.js)");
console.log("JWT_SECRET:", process.env.JWT_SECRET || "No configurado");

// Body parsers (importante que vayan antes que las rutas)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS debe ir ANTES de session
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

app.use(cookieParser());

// Debe venir después de CORS
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave_secreta_segura',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 // 1 día
  }
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('req.body:', req.body);
  console.log('req.cookies:', req.cookies);
  console.log('req.session:', req.session);
  next();
});

// Rutas API
app.use('/api', usuarioRouter);
app.use('/api', loginRouter);
app.use('/api/productos', productosRouter);
app.use('/api/categorias', categoriasRoute);

// Middleware para rutas no existentes (útil para debugging)
app.use((req, res) => {
  console.warn(`Ruta no manejada: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(port, async () => {
    try {
        await connectToDatabase();
        console.log(`Servidor backend local iniciado en http://localhost:${port}`);
        console.log(`Rutas protegidas requieren autenticación JWT`);
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        process.exit(1); // Detener la aplicación si no hay conexión a DB
    }
});

// /* global process */
/* import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import connectToDatabase from './database/connectionMySQL.js';
import cors from 'cors';
import usuarioRouter from './database/insertUser.js';
import loginRouter from './database/comprobarRol.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para ES Modules (porque usas 'import')
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

console.log("Node.js está usando JWT_SECRET:", process.env.JWT_SECRET);

// Habilitar CORS (ajusta el origen en producción)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tudominio.com' 
    : 'http://localhost:5173',
  credentials: true
}));

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas API
app.use('/api', usuarioRouter);
app.use('/api', loginRouter);

// --- Configuración para producción (punto 3) ---
if (process.env.NODE_ENV === 'production') {
  // 1. Sirve archivos estáticos del frontend (React/Vite)
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // 2. Todas las rutas no manejadas por API sirven el index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

// Iniciar servidor
app.listen(port, async () => {
    try {
        await connectToDatabase();
        console.log(`Servidor iniciado en http://localhost:${port}`);
    } catch (err) {
        console.error('No se pudo conectar a la base de datos:', err.message);
    }
}); */