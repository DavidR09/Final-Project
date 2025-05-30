import mysql from 'mysql2/promise';

let connection;

async function connectToDatabase() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'laspalmas1M',
            database: 'respuestogra',
            port: 3306
        });
        console.log('Conectado a la base de datos Repuestos GRA');
    }
    return connection;
}

export default connectToDatabase;
