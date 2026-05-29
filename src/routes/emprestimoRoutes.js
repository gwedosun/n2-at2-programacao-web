const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');
const { verificarAutenticacao, permitirBibliotecario, permitirLeitor } = require('../middlewares/authMiddleware');

router.get('/', verificarAutenticacao, permitirBibliotecario, emprestimoController.listarTodos); 
router.get('/meus-emprestimos', verificarAutenticacao, permitirLeitor, emprestimoController.listarPorUsuario); 
router.post('/', verificarAutenticacao, permitirLeitor, emprestimoController.solicitarEmprestimo); 
router.put('/:id/devolucao', verificarAutenticacao, permitirBibliotecario, emprestimoController.registrarDevolucao); 
router.delete('/:id', verificarAutenticacao, permitirBibliotecario, emprestimoController.cancelarEmprestimo);

module.exports = router;