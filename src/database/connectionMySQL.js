import mysql from 'mysql2/promise';

let connection;

async function connectToDatabase() {
    if (!connection) {
        connection = await mysql.createConnection({
            host: 'bl1y8xb3pst0jrf0v0ur-mysql.services.clever-cloud.com',
            user: 'upblfsqfoehyidyp',
            password: 'V9bCQlga4xXOXTZvsBrT',
            database: 'bl1y8xb3pst0jrf0v0ur',
        });
        console.log('Conectado a la base de datos Repuestos GRA');
    }
    return connection;
}

export default connectToDatabase;
