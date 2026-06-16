const mysql = require('mysql2');

const database = mysql.createConnection({
    host: process.env.DB_HOST,         // Mudou de database_HOST para DB_HOST
    user: process.env.DB_USER,         // Mudou de database_USER para DB_USER
    password: process.env.DB_PASS,     // Mudou de database_PASS para DB_PASS
    database: process.env.DB_NAME,     // Mudou de database_NAME para DB_NAME
    port: process.env.DB_PORT || 3306  // Mudou de database_PORT para DB_PORT
});

database.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados.');
});

module.exports = database;