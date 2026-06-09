const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');
const { verificarAutenticacao, permitirBibliotecario } = require('../middlewares/authMiddleware');

router.get('/', verificarAutenticacao, livroController.listarTodos); 
router.get('/:id', verificarAutenticacao, livroController.buscarPorId);
router.post('/', verificarAutenticacao, permitirBibliotecario, livroController.criar); 
router.put('/:id', verificarAutenticacao, permitirBibliotecario, livroController.atualizar); 
router.delete('/:id', verificarAutenticacao, permitirBibliotecario, livroController.deletar); 

module.exports = router;