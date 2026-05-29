const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
 
app.use(express.static(path.join(__dirname, '..', 'public')));
 
app.use(express.json());
 
app.use(session({
    secret: 'senha-da-biblioteca', 
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 } 
}));
 
const authRoutes = require('./routes/authRoutes');
const livroRoutes = require('./routes/livroRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');
 
app.use('/auth', authRoutes);
app.use('/livros', livroRoutes);
app.use('/emprestimos', emprestimoRoutes);
 
module.exports = app;
 