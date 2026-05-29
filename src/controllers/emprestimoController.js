const db = require('../config/database');

const listarTodos = async (req, res) => {
    // Exibe todos os empréstimos cadastrados do sistema para o painel de gerenciamento [cite: 92]
};

const listarPorUsuario = async (req, res) => {
    // Retorna os empréstimos ativos vinculados ao leitor logado [cite: 38, 99]
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