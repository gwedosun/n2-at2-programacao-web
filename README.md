Integrantes: Beatriz Evangelista, Gabriella Braga e Keven Régio. <br> <br>
# Sobre o projeto
Sistema web completo para gerenciamento de empréstimos de livros em uma biblioteca, desenvolvido como trabalho acadêmico para a disciplina de Programação para Web.
<br>
O sistema conta com dois perfis de usuário com permissões distintas: <br>
Bibliotecário: Responsável por gerenciar o catálogo de livros (CRUD completo) e aprovar devoluções. <br>
Leitor: Pode visualizar livros, solicitar empréstimos e solicitar devoluções. <br>

# Ferramentas utilizadas
Backend: Node.js | Express | MySQL2 | Express-session | Bcrypt | Dotenv <br>
Frontend: HTML5 | CSS3 | JavaScript | Fetch API <br>
Banco de Dados: MySQL <br>

# Pré-requisitos
- Node.js | versão 14 ou superior <br>
- MySQL | versão 8.0 ou superior <br>
- NPM <br>

# Instalação e configuração de ambiente
1. Clone o repositório na sua máquina com <br>
`git clone [URL_DO_REPOSITORIO]`
`cd [NOME_DO_PROJETO]`

2. Instale as dependências do projeto com
`npm install`

3. Configure as variáveis de ambiente
- Crie um arquivo .env na raiz do projeto com as seguintes configurações: <br>
`DB_HOST=localhost` <br>
`DB_USER=root` <br>
`DB_PASS=SUA_SENHA_DO_MYSQL` <br>
`DB_NAME=sistBiblioteca` <br>
`DB_PORT=3306` <br>
`PORT=3000` <br>

4. Abra o MySQL Workbench e execute o schema.sql <br>
(ou use `mysql -u root -p < schema.sql`)

5. Inicie o servidor com <br>
`npx nodemon server.js`

## caso algum pacote não funcione
instale diretamente `npm install express express-session mysql2 bcrypt dotenv`, além do NODEMON `npm install -g nodemon` para a atualização em tempo real do servidor.

# Sobre a segurança 
- Senhas armazenadas com hash usando bcrypt; <br>
- Sessões gerenciadas com express-session; <br>
- Validações de permissão em todas as rotas; <br>
- Proteção contra SQL Injection <br>
