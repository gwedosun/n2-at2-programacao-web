## pre requisitos
# nodejs
# mysql

## instale as dependencias do projeto
# crie o .env
na raiz do projeto e adicione:
`DB_HOST=localhost`
`DB_USER=root`
`DB_PASS=SUA_SENHA_DO_MYSQL`
`DB_NAME=sistBiblioteca`
`DB_PORT=3306`
`PORT=3000`

## abra o mysql workbench e execute o schema.sql

# caso algum pacote não funcione
instale diretamente `npm install express express-session mysql2 bcrypt dotenv`, além do NODEMON para a atualização em tempo real do servidor.

## inicie o projeto
com `npx nodemon server.js`