document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-password').value;

    const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha})
    });

    const data = await res.json();
    
    if (res.ok) {
        alert('Bem vindo!');
        
        sessionStorage.setItem('userAuthenticated', 'true');
        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));

        // Redirecionamento inteligente baseado no perfil do banco de dados
        if (data.usuario.perfil === 'bibliotecario') {
            window.location.href = '/bibliotecario.html';
        } else {
            window.location.href = '/leitor.html';
        }
    } else {
        alert('Erro: ' + data.erro);
    }
});