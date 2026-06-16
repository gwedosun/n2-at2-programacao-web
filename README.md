# pre requisitos
nodejs & mysql

# instale as dependencias do projeto
## crie o .env
na raiz do projeto e adicione:
`DB_HOST=localhost` <br>
`DB_USER=root` <br>
`DB_PASS=SUA_SENHA_DO_MYSQL` <br>
`DB_NAME=sistBiblioteca` <br>
`DB_PORT=3306` <br>
`PORT=3000` <br>

# abra o mysql workbench e execute o schema.sql

## caso algum pacote não funcione
instale diretamente `npm install express express-session mysql2 bcrypt dotenv`, além do NODEMON para a atualização em tempo real do servidor.

# inicie o projeto
com `npx nodemon server.js`