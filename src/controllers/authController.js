const db = require('../config/database');
const bcrypt = require('bcrypt');

const registrar = async (req, res) => {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha || !perfil) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }
    if (!['bibliotecario', 'leitor'].includes(perfil)) {
        return res.status(400).json({ erro: 'Perfil inválido.' });
    }

    try {
        const saltRounds = 10;
        const senhaCript = await bcrypt.hash(senha, saltRounds);

        const [resultado] = await db.execute(
            'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
            [nome, email, senhaCript, perfil]
        );

    } catch (err) {
        const status = err.code === 'ER_DUP_ENTRY' ? 409 : 500;
        const mensagem = status === 409 ? 'E-mail já cadastrado.' : 'Erro ao registrar usuário.';
        res.status(status).json({ erro: mensagem });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
    }

    try {
        const [rows] = await db.execute(
            'SELECT id, nome, perfil, senha FROM usuarios WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ erro: 'Email ou senha inválidos.' });
        }

        const usuario = rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ erro: 'Email ou senha inválidos. '})
        }

        res.json({ id: usuario.id, perfil: usuario.perfil });

    } catch (err) {
        res.status(500).json({ erro: 'Erro ao fazer login.' });
    }
};

const logout = async (req, res) => {
    try {
        res.json({ msg: 'Logout realizado.'});
    } catch (err) {
        console.log(err);
        res.status(500).json({ erro: 'Erro ao fazer logout.'})
    }
}

module.exports = {
    registrar,
    login,
    logout
};