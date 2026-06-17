const db = require('../config/database');

const listarTodos = async (req, res) => {
    try {
        const [emprestimos] = await db.execute(`
            SELECT e.id, e.leitor_id, u.nome AS nome_leitor,
                   e.livro_id, l.titulo AS titulo_livro,
                   e.data_emprestimo, e.data_devolucao_prevista, e.status
            FROM emprestimos e
            INNER JOIN usuarios u ON e.leitor_id = u.id
            INNER JOIN livros l ON e.livro_id = l.id
        `);
        res.json(emprestimos);
    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao listar empréstimos.' });
    }
};

const listarPorUsuario = async (req, res) => {
    try {
        const idUsuario = req.session.usuario.id; 

        const [rows] = await db.execute(
            'SELECT e.id, e.data_emprestimo, e.data_devolucao_prevista, l.titulo, e.status FROM emprestimos e INNER JOIN livros l ON e.livro_id = l.id WHERE e.leitor_id = ?', // Mantém e.leitor_id
            [idUsuario]
        );
        
        return res.json(rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao buscar empréstimos do usuário.'});
    }
};

const solicitarEmprestimo = async (req, res) => {
    const { livro_id, leitor_id, data_devolucao_prevista } = req.body;

    try {
        const [livros] = await db.execute(
            'SELECT quantidade_disponivel FROM livros WHERE id = ?',
        [livro_id]
    );

    if (livros.length === 0) {
            return res.status(404).json({ erro: 'Livro não encontrado.' });
        }

        if (livros[0].quantidade_disponivel <= 0) {
            return res.status(400).json({ erro: 'Livro indisponível no momento.' });
        }

        await db.execute(
            'INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status) VALUES (?, ?, CURDATE(), ?, "ativo")',
            [livro_id, leitor_id, data_devolucao_prevista]
        );

        await db.execute(
            'UPDATE livros SET quantidade_disponivel = quantidade_disponivel - 1 WHERE id = ?',
            [livro_id]
        );

        res.status(201).json({ mensagem: 'Empréstimo solicitado com sucesso!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao solicitar empréstimo.'})
    }

};

const registrarDevolucao = async (req, res) => {
    const { id } = req.params;

    try {
        const [emprestimos] = await db.execute('SELECT livro_id, status FROM emprestimos WHERE id = ?', [id]);

        if (emprestimos.length === 0) {
            return res.status(404).json({ erro: 'Empréstimo não encontrado.' });
        }

        if (emprestimos[0].status === 'devolvido') {
            return res.status(400).json({ erro: 'Este empréstimo já foi devolvido anteriormente.' });
        }
        const { livro_id } = emprestimos[0];

        await db.execute(
            'UPDATE emprestimos SET status = "devolvido", data_devolucao_real = CURDATE() WHERE id = ?',
            [id]
        );

        await db.execute(
            'UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?',
            [livro_id]
        );
        res.json({ mensagem: 'Devolução registrada com sucesso!' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao registrar devolução.' });
    }
};

const cancelarEmprestimo = async (req, res) => {
    const { id } = req.params;

    try {
        const [emprestimos] = await db.execute('SELECT livro_id, status FROM emprestimos WHERE id = ?', [id]);

        if (emprestimos.length === 0) {
            return res.status(404).json({ erro: 'Empréstimo não encontrado.' });
        }
        const { livro_id, status } = emprestimos[0];

        if (status === 'ativo' || status === 'atrasado') {
            await db.execute(
                'UPDATE livros SET quantidade_disponivel = quantidade_disponivel + 1 WHERE id = ?',
                [livro_id]
            );
        }

        await db.execute('DELETE FROM emprestimos WHERE id = ?', [id]);
        res.json({ mensagem: 'Empréstimo cancelado com sucesso!' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao cancelar empréstimo.' });
    }
};

module.exports = {
    listarTodos,
    listarPorUsuario,
    solicitarEmprestimo,
    registrarDevolucao,
    cancelarEmprestimo
};