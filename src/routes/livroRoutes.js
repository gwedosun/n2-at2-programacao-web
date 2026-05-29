const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');
const { verificarAutenticacao, permitirBibliotecario } = require('../middlewares/authMiddleware');

router.get('/', verificarAutenticacao, livroController.listarTodos); // [cite: 37, 96, 105]
router.get('/:id', verificarAutenticacao, livroController.buscarPorId); // [cite: 40]
router.post('/', verificarAutenticacao, permitirBibliotecario, livroController.criar); // [cite: 11, 42, 51]
router.put('/:id', verificarAutenticacao, permitirBibliotecario, livroController.atualizar); // [cite: 11, 45, 51]
router.delete('/:id', verificarAutenticacao, permitirBibliotecario, livroController.deletar); // [cite: 11, 49, 51]

module.exports = router;