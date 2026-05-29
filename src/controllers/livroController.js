const db = require('../config/database');

const listarTodos = async (req, res) => {
    try {
        const [livros] = await db.execute(
            'SELECT * FROM livros');
            res.json(livros);
    
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao listar livros.' });
    }
};

const buscarPorId = async (req, res) => {
};

const criar = async (req, res) => {
};

const atualizar = async (req, res) => {
};

const deletar = async (req, res) => {
    try {
        const [resultado] = await db.execute(
            'DELETE FROM livros WHERE id = ?', [req.params.id]);

            if (resultado.affectedRows === 0) return res.status(404).json({ erro: 'Livro não encontrado.'});
            res.json({ mensagem = 'Livro removido.' });

    } catch (err) {
        res.status(500).json({ erro: 'Erro ao deletar livro.' })
    }
};

module.exports = {
    listarTodos,
    // buscarPorId,
    // criar,
    // atualizar,
    deletar
};