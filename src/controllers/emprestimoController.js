const db = require('../config/database');

const listarTodos = async (req, res) => {
    try {
        const [emprestimos] = await db.execute(
            'SELECT * FROM emprestimos');
        res.json(emprestimos);
    
    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao listar empréstimos.' });
    }};

const listarPorUsuario = async (req, res) => {
    const { idUsuario } = req.params;

        try {
        const [rows] = await db.execute(
            'SELECT e.id, e.data_emprestimo, e.data_devolucao_prevista, l.titulo FROM emprestimos e INNER JOIN livros l ON e.livro_id = l.id WHERE e.usuario_id = ?',
            [idUsuario]
        );
        res.json(rows);

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao buscar empréstimos do usuário.'});
    }
};

const solicitarEmprestimo = async (req, res) => {
    // Cria o registro com status 'ativo' e reduz quantidade_disponivel do livro [cite: 54, 56]
};

const registrarDevolucao = async (req, res) => {
    // Muda status para 'devolvido', insere data_devolucao_real e aumenta quantidade_disponivel [cite: 29, 55, 57]
};

const cancelarEmprestimo = async (req, res) => {
    // Remove ou desativa um registro de empréstimo [cite: 50]
};

module.exports = {
    listarTodos,
    listarPorUsuario,
    solicitarEmprestimo,
    registrarDevolucao,
    cancelarEmprestimo
};