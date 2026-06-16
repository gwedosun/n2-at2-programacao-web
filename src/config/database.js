const mysql = require('mysql2/promise');

let database;

async function conectar() {
    database = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'SistBiblioteca',
        port: '3306'
    });
    console.log('Conectado ao banco de dados.');
    return database;
}

conectar();

module.exports = {
    execute: (...args) => database.execute(...args)
};