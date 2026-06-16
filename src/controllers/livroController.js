const db = require('../config/database');

const listarTodos = async (req, res) => {
    try {
        const [livros] = await db.execute(
            'SELECT * FROM livros');
        res.json(livros);
    
    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao listar livros.' });
    }
};

const buscarPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM livros WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Livro não encontrado.'});
        }
        // const livro = rows[0];
        // res.json(livro);

        return res.json(rows[0]);

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao buscar o livro.'});
    }
};

const criar = async (req, res) => {
    try {
        const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;

        if (!titulo || !autor) {
            return res.status(400).json({ erro: 'Título e autor são obrigatórios.'});
        }

        const [resultado] = await db.execute(
            'INSERT INTO livros (titulo, autor, ano_publicacao, quantidade_disponivel) VALUES (?, ?, ?, ?)',
            [titulo, autor, ano_publicacao, quantidade_disponivel]
        );
        
        return res.status(201).json({ mensagem: 'Livro adicionado com sucesso!' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao adicionar livro.' });
    }
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const { titulo, autor, ano_publicacao, quantidade_disponivel } = req.body;

    if (!titulo || !autor) {
        return res.status(400).json({ erro: 'Título e autor são obrigatórios para atualizar.'});
    }

    try {
        const [resultado] = await db.execute(
            'UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, quantidade_disponivel = ? WHERE id = ?',
            [titulo, autor, ano_publicacao, quantidade_disponivel, id]
        )

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Livro não encontrado. Não foi possível atualizar.'});
        }
        res.json({ mensagem: 'Livro atualizado com sucesso!' });

    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao atualizar livro.'})
    }
};

const deletar = async (req, res) => {
    const { id } = req.params;

    try {
        const [resultado] = await db.execute(
            'DELETE FROM livros WHERE id = ?', [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Livro não encontrado.' });
        }

        res.json({ mensagem: 'Livro removido com sucesso.' });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao deletar livro.' });
    }
    };

module.exports = {
    listarTodos,
    buscarPorId,
    criar,
    atualizar,
    deletar
};