const mysql = require('mysql2');

const database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sua_senha',
    database: 'inserir_nome', 
    port: '3000'
});

database.connect(err => {
    if (err) throw err;
    console.log('Conectado ao banco de dados.')
})

module.exports = database;