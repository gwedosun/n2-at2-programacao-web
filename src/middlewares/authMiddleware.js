const verificarAutenticacao = (req, res, next) => {
    if (!req.session || !req.session.usuario) {
        return res.status(401).json({ erro: 'Não autenticado. Faça login.' });
    }
    next();
};

const permitirBibliotecario = (req, res, next) => {
    if (req.session.usuario.perfil !== 'bibliotecario') {
        return res.status(403).json({ erro: 'Acesso restrito a bibliotecários.' });
    }
    next();
};

const permitirLeitor = (req, res, next) => {
    if (req.session.usuario.perfil !== 'leitor') {
        return res.status(403).json({ erro: 'Acesso restrito a leitores.' });
    }
    next();
};

module.exports = {
    verificarAutenticacao,
    permitirBibliotecario,
    permitirLeitor
};
