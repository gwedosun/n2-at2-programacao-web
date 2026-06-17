document.addEventListener('DOMContentLoaded', () => {
    init();
});

let usuarioLogado = null;
let livrosDisponiveis = [];

async function init() {
    const usuarioSalvo = sessionStorage.getItem('usuario');

    if (!sessionStorage.getItem('userAuthenticated') || !usuarioSalvo) {
        window.location.href = '/';
        return;
    }

    usuarioLogado = JSON.parse(usuarioSalvo);

    // Evento de Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        sessionStorage.clear();
        window.location.href = '/';
    });

    // Ouvinte para o Botão Principal superior "+ Solicitar Novo Empréstimo"
    const btnPrincipal = document.getElementById('btn-novo-emprestimo-principal');
    if (btnPrincipal) {
        btnPrincipal.addEventListener('click', () => {
            abrirModalEmprestimo(); 
        });
    }

    // Eventos de Fechamento do Modal (Botão inferior e o 'X' do cabeçalho)
    document.getElementById('btn-fechar-modal')?.addEventListener('click', fecharModal);
    document.getElementById('btn-fechar-modal-x')?.addEventListener('click', fecharModal);
    
    // Evento de envio do formulário
    document.getElementById('form-solicitar-emprestimo')?.addEventListener('submit', enviarSolicitacaoEmprestimo);

    // Carrega os dados nas tabelas
    await carregarDadosPainel();

    document.getElementById('busca-catalogo')?.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = livrosDisponiveis.filter(livro =>
        livro.titulo.toLowerCase().includes(termo) ||
        livro.autor.toLowerCase().includes(termo)
    );
    renderizarCatalogo(filtrados);
});
}

async function carregarDadosPainel() {
    await carregarCatalogoLivros();
    await carregarEmprestimosLeitor();
}

// 1. CARREGAR TODOS OS LIVROS
async function carregarCatalogoLivros() {
    try {
        const res = await fetch('/livros', { credentials: 'include' });
        if (!res.ok) throw new Error('Erro ao buscar catálogo de livros.');
        
        livrosDisponiveis = await res.json(); 
        renderizarCatalogo(livrosDisponiveis);
        popularSelectLivros(livrosDisponiveis); 
    } catch (err) {
        console.error(err);
        document.getElementById('catalogo-livros-list').innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--danger);">Erro ao carregar catálogo.</td></tr>';
    }
}

function renderizarCatalogo(livros) {
    const tbody = document.getElementById('catalogo-livros-list');
    tbody.innerHTML = '';

    if (livros.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Nenhum livro disponível no momento.</td></tr>';
        return;
    }

    livros.forEach(livro => {
        const tr = document.createElement('tr');
        const temEstoque = livro.quantidade_disponivel > 0;
        const btnTexto = temEstoque ? 'Solicitar' : 'Indisponível';
        const btnDisabled = temEstoque ? '' : 'disabled style="background-color: var(--border); color: var(--text-muted); cursor: not-allowed;"';

        tr.innerHTML = `
            <td>${livro.id}</td>
            <td><strong>${livro.titulo}</strong></td>
            <td>${livro.autor}</td>
            <td>${livro.ano_publicacao || 'N/A'}</td>
            <td>${livro.quantidade_disponivel}</td>
            <td>
                <button class="btn-solicitar-table" ${btnDisabled} onclick="abrirModalEmprestimo(${livro.id})">
                    ${btnTexto}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function popularSelectLivros(livros) {
    const select = document.getElementById('modal-livro-select');
    select.innerHTML = '<option value="">-- Escolha um livro --</option>';

    livros.forEach(livro => {
        if (livro.quantidade_disponivel > 0) {
            const option = document.createElement('option');
            option.value = livro.id;
            option.textContent = `${livro.titulo} — ${livro.autor}`;
            select.appendChild(option);
        }
    });
}

// 2. CARREGAR EMPRÉSTIMOS DO LEITOR
async function carregarEmprestimosLeitor() {
    try {
        const res = await fetch('/emprestimos/meus-emprestimos', { credentials: 'include' });
        if (!res.ok) throw new Error('Erro ao buscar empréstimos.');
        
        const emprestimos = await res.json();
        renderizarEmprestimos(emprestimos);
    } catch (err) {
        console.error(err);
        document.getElementById('meus-emprestimos-list').innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--danger);">Erro ao carregar seus empréstimos.</td></tr>';
    }
}

function renderizarEmprestimos(emprestimos) {
    const tbody = document.getElementById('meus-emprestimos-list');
    tbody.innerHTML = '';

    let ativos = 0, devolvidos = 0, atrasados = 0;

    if (emprestimos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Você não possui nenhum empréstimo registrado.</td></tr>';
    } else {
        emprestimos.forEach(emp => {
            if (emp.status === 'atrasado') { atrasados++; ativos++; }
            else if (emp.status === 'devolvido') { devolvidos++; }
            else { ativos++; }

            const dataEmp = new Date(emp.data_emprestimo).toLocaleDateString('pt-BR');
            const dataPrev = new Date(emp.data_devolucao_prevista).toLocaleDateString('pt-BR');

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${emp.id}</td>
                <td><strong>${emp.titulo}</strong></td>
                <td>${dataEmp}</td>
                <td>${dataPrev}</td>
                <td><span class="status-tag ${emp.status}" style="position:static; padding: 2px 8px;">${emp.status.toUpperCase()}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }

    document.getElementById('total-emprestados').textContent = ativos;
    document.getElementById('total-devolvidos').textContent = devolvidos;
    document.getElementById('total-atrasados').textContent = atrasados;
}

// 3. LOGICA DO MODAL
function abrirModalEmprestimo(idSelecionado = null) {
    const modal = document.getElementById('modal-emprestimo');
    if (!modal) return;

    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    document.getElementById('modal-data-prevista').min = amanha.toISOString().split('T')[0];

    const selectLivro = document.getElementById('modal-livro-select');
    if (idSelecionado) {
        selectLivro.value = idSelecionado;
    } else {
        selectLivro.value = "";
    }

    modal.style.display = 'flex';
}

function fecharModal() {
    const modal = document.getElementById('modal-emprestimo');
    if (modal) {
        modal.style.display = 'none';
    }
    document.getElementById('form-solicitar-emprestimo').reset();
}

async function enviarSolicitacaoEmprestimo(e) {
    e.preventDefault();

    const livro_id = document.getElementById('modal-livro-select').value;
    const data_devolucao_prevista = document.getElementById('modal-data-prevista').value;

    if (!livro_id) {
        alert('Por favor, selecione um livro.');
        return;
    }

    const dados = {
        livro_id: parseInt(livro_id),
        leitor_id: usuarioLogado.id,
        data_devolucao_prevista: data_devolucao_prevista
    };

    try {
        const res = await fetch('/emprestimos', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        const resultado = await res.json();

        if (!res.ok) {
            throw new Error(resultado.erro || 'Erro ao solicitar empréstimo.');
        }

        alert('Empréstimo solicitado com sucesso!');
        fecharModal();
        await carregarDadosPainel(); 

    } catch (err) {
        alert(err.message);
    }
}