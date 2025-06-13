/* global process */
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config(); // Cargar las variables del archivo .env

async function connectToDatabase() {
    try {
        // Verificar que todas las variables de entorno necesarias estén definidas
        const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
            throw new Error(`Faltan variables de entorno requeridas: ${missingVars.join(', ')}`);
        }

        // Crear una nueva conexión cada vez
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('Conectado a la base de datos Repuestos GRA');
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', {
            message: error.message,
            code: error.code,
            errno: error.errno,
            sqlMessage: error.sqlMessage,
            sqlState: error.sqlState
        });
        throw error;
    }
}

export default connectToDatabase;