/* global process */
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import connectToDatabase from './database/connectionMySQL.js';
import cors from 'cors';
import usuarioRouter from './database/insertUser.js'; // Ajusta la ruta según tu estructura
import loginRouter from './database/comprobarRol.js'; // Ajusta el path según tu estructura

const app = express();
const port = 3000; // o 4000, 5000, etc.

console.log("Node.js está usando JWT_SECRET:", process.env.JWT_SECRET);

console.log('Entorno:', typeof process !== 'undefined' ? 'Node.js' : 'Navegador');

// Habilitar CORS
app.use(cors({
  origin: 'http://localhost:5173', // o '*' si estás probando localmente
    credentials: true
}));

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar el router de usuarios
app.use('/api', usuarioRouter);

// Usa el router para /login
app.use('/api', loginRouter); // o `app.use('/api', loginRouter);` si lo prefieres

// Resto de tu configuración...
app.listen(port, async () => {
    try {
        await connectToDatabase();
        console.log(`Servidor iniciado en http://localhost:${port}`);
    } catch (err) {
        console.error('No se pudo conectar a la base de datos:', err.message);
    }
});