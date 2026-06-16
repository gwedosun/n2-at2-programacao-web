document.getElementById('cadastro-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome  = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-password').value;
    const perfil = document.getElementById('reg-perfil').value.toLowerCase().trim();

    const res = await fetch('/auth/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, perfil })
    });

    const data = await res.json();
    
    if (res.ok) {
        alert('Conta criada com sucesso!');
        window.location.href = '/';
    } else {
        alert('Erro: ' + data.erro);
    }
});