import express from 'express';
import connectToDatabase from './database/connectionMySQL.js';
import cors from 'cors';
import usuarioRouter from './database/insertUser.js'; // Ajusta la ruta según tu estructura

const app = express();
const port = 3000;

// Habilitar CORS
app.use(cors({
  origin: 'http://localhost:5173', // o '*' si estás probando localmente
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar el router de usuarios
app.use('/api', usuarioRouter);

// Resto de tu configuración...
app.listen(port, async () => {
    try {
        await connectToDatabase();
        console.log(`Servidor iniciado en http://localhost:${port}`);
    } catch (err) {
        console.error('No se pudo conectar a la base de datos:', err.message);
    }
});