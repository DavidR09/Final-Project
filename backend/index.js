/* global process */
import dotenv from 'dotenv';
dotenv.config();
console.log('DB_USER:', process.env.DB_USER);

import express from 'express';
import cookieParser from 'cookie-parser';
import connectToDatabase from './database/connectionMySQL.js';
import cors from 'cors';
import usuariosRouter from './routes/usuarios.js';
import loginRouter from './database/comprobarRol.js';
import productosRouter from './productos.js';
import categoriasRoute from './categoriasRoute.js';
import authRouter from './routes/auth.js';

const app = express();
const port = 3000;

// Verificar variables de entorno críticas
if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET no está configurado en el archivo .env');
  process.exit(1);
}

// Configuración para desarrollo local
console.log("Entorno: Desarrollo Local (Node.js)");
console.log("JWT_SECRET:", process.env.JWT_SECRET || "No configurado");

// Middleware para parsear cookies ANTES de CORS
app.use(cookieParser(process.env.JWT_SECRET));

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'https://respuestosgra.up.railway.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 horas
};

app.use(cors(corsOptions));

// Middleware para OPTIONS
app.options('*', cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  console.log('Cookies parseadas:', req.cookies);
  console.log('Cookies firmadas:', req.signedCookies);
  next();
});

// Middleware para manejar errores de JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON malformado' });
  }
  next();
});

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/login', loginRouter);
app.use('/api/productos', productosRouter);
app.use('/api/categorias', categoriasRoute);

// Manejador de rutas no encontradas
app.use((req, res) => {
  console.log(`Ruta no encontrada: ${req.path}`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Iniciar servidor
app.listen(port, async () => {
    try {
        await connectToDatabase();
        console.log(`Servidor backend local iniciado en http://localhost:${port}`);
        console.log('JWT_SECRET está configurado correctamente');
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