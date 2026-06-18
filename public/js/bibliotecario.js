let todosEmprestimos = [];

document.addEventListener('DOMContentLoaded', () => {
    initBibliotecario();
});

async function initBibliotecario() {
    const usuarioSalvo = sessionStorage.getItem('usuario');
    if (!sessionStorage.getItem('userAuthenticated') || !usuarioSalvo) {
        window.location.href = '/';
        return;
    }

    // Botão Sair
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = '/';
    });

    document.getElementById('btn-novo-livro')?.addEventListener('click', () => abrirModalLivro());
    document.getElementById('btn-fechar-modal')?.addEventListener('click', fecharModalLivro);
    document.getElementById('btn-fechar-modal-x')?.addEventListener('click', fecharModalLivro);
    document.getElementById('form-livro')?.addEventListener('submit', salvarLivro);

    document.getElementById('busca-emprestimo')?.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = todosEmprestimos.filter(emp =>
            (emp.nome_leitor || '').toLowerCase().includes(termo) ||
            (emp.titulo_livro || '').toLowerCase().includes(termo)
        );
        renderizarEmprestimos(filtrados);
    });

    await carregarDadosPainel();
}

async function carregarDadosPainel() {
    await carregarLivrosGeral();
    await carregarEmprestimosGeral();
}



async function carregarLivrosGeral() {
    try {
        const res = await fetch('/livros', { credentials: 'include' });
        if (!res.ok) throw new Error('Erro ao buscar acervo.');
        const livros = await res.json();

        const tbody = document.getElementById('lista-livros-adm');
        tbody.innerHTML = '';

        if (livros.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum livro registrado no acervo.</td></tr>';
            return;
        }

        livros.forEach(livro => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${livro.id}</td>
                <td><strong>${livro.titulo}</strong></td>
                <td>${livro.autor}</td>
                <td>${livro.ano_publicacao || 'N/A'}</td>
                <td>${livro.quantidade_disponivel} exemplares</td>
                <td>
                    <button class="btn-table-action btn-table-edit" onclick="prepararEdicao(${livro.id}, '${(livro.titulo || '').replace(/'/g, "\\'")}', '${(livro.autor || '').replace(/'/g, "\\'")}', ${livro.ano_publicacao || null}, ${livro.quantidade_disponivel || 0})">Editar</button>
                    <button class="btn-table-action btn-table-delete" onclick="deletarLivro(${livro.id})">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        console.error(err);
    }
}

function abrirModalLivro() {
    document.getElementById('form-livro').reset();
    document.getElementById('edit-book-id').value = '';
    document.getElementById('modal-titulo-livro').textContent = 'Cadastrar Nova Obra';
    document.getElementById('modal-livro').style.display = 'flex';
}

function fecharModalLivro() {
    document.getElementById('modal-livro').style.display = 'none';
}

function prepararEdicao(id, titulo, autor, ano, quantidade) {
    document.getElementById('edit-book-id').value = id;
    document.getElementById('book-title').value = titulo;
    document.getElementById('book-author').value = autor;
    document.getElementById('book-year').value = ano || '';
    document.getElementById('book-quantity').value = quantidade;
    document.getElementById('modal-titulo-livro').textContent = 'Editar Detalhes da Obra';
    document.getElementById('modal-livro').style.display = 'flex';
}

async function salvarLivro(e) {
    e.preventDefault();
    const id = document.getElementById('edit-book-id').value;

    const payload = {
        titulo: document.getElementById('book-title').value,
        autor: document.getElementById('book-author').value,
        ano_publicacao: document.getElementById('book-year').value ? parseInt(document.getElementById('book-year').value) : null,
        quantidade_disponivel: parseInt(document.getElementById('book-quantity').value)
    };

    const url = id ? `/livros/${id}` : '/livros';
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || 'Erro ao processar requisição.');

        alert(id ? 'Obra atualizada com sucesso!' : 'Nova obra cadastrada!');
        fecharModalLivro();
        await carregarLivrosGeral();
    } catch (err) {
        alert(err.message);
    }
}

async function deletarLivro(id) {
    if (!confirm('Tem certeza de que deseja remover este livro do sistema?')) return;

    try {
        const res = await fetch(`/livros/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || 'Erro ao remover obra.');

        alert('Livro removido com sucesso!');
        await carregarLivrosGeral();
    } catch (err) {
        alert(err.message);
    }
}

// emprestimos

async function carregarEmprestimosGeral() {
    try {
        const res = await fetch('/emprestimos', { credentials: 'include' });
        if (!res.ok) throw new Error('Erro ao buscar lista de empréstimos.');
        todosEmprestimos = await res.json();
        renderizarEmprestimos(todosEmprestimos);
    } catch (err) {
        console.error(err);
    }
}

function renderizarEmprestimos(emprestimos) {
    const tbody = document.getElementById('lista-emprestimos-adm');
    tbody.innerHTML = '';

    if (emprestimos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Nenhum empréstimo encontrado.</td></tr>';
        return;
    }

    emprestimos.forEach(emp => {
        const tr = document.createElement('tr');
        const dataEmp = new Date(emp.data_emprestimo).toLocaleDateString('pt-BR');
        const dataPrev = new Date(emp.data_devolucao_prevista).toLocaleDateString('pt-BR');
        const statusBotaoDevolucao = emp.status !== 'devolvido'
            ? `<button class="btn-table-action btn-table-success" onclick="marcarComoDevolvido(${emp.id})">Aprovar Devolução</button>`
            : `<span style="color:var(--text-muted); margin-right: 10px;">Finalizado</span>`;
        const botaoExcluir = `<button class="btn-table-action btn-table-delete" onclick="excluirEmprestimo(${emp.id})">Excluir</button>`;

        tr.innerHTML = `
            <td>${emp.id}</td>
            <td>${emp.nome_leitor}</td>
            <td>${emp.titulo_livro}</td>
            <td>${dataEmp}</td>
            <td>${dataPrev}</td>
            <td><span class="status-tag ${emp.status}" style="position:static; padding: 2px 8px;">${emp.status.toUpperCase()}</span></td>
            <td>${statusBotaoDevolucao}${botaoExcluir}</td>
        `;
        tbody.appendChild(tr);
    });
}

async function excluirEmprestimo(id) {
    if (!confirm('Tem certeza de que deseja deletar permanentemente o registro deste empréstimo?')) return;

    try {
        const res = await fetch(`/emprestimos/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || 'Erro ao deletar empréstimo.');

        alert('Registro de empréstimo deletado com sucesso!');
        await carregarDadosPainel();
    } catch (err) {
        alert(err.message);
    }
}

async function marcarComoDevolvido(id) {
    try {
        const res = await fetch(`/emprestimos/${id}/devolucao`, {
            method: 'PUT',
            credentials: 'include'
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.erro || 'Erro ao registrar devolução.');

        alert('Devolução homologada com sucesso!');
        await carregarDadosPainel();
    } catch (err) {
        alert(err.message);
    }
}