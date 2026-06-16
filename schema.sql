create schema sistBiblioteca;
use sistBiblioteca;

-- Tabela de Usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('bibliotecario', 'leitor') NOT NULL
);

-- Tabela de Livros
CREATE TABLE livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ano_publicacao INT,
    quantidade_disponivel INT NOT NULL
);

-- Tabela de Empréstimos
CREATE TABLE emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    livro_id INT NOT NULL,
    leitor_id INT NOT NULL,
    data_emprestimo DATE NOT NULL,
    data_devolucao_prevista DATE NOT NULL,
    data_devolucao_real DATE,
    status ENUM('ativo', 'devolvido', 'atrasado') NOT NULL,
    FOREIGN KEY (livro_id) REFERENCES livros(id),
    FOREIGN KEY (leitor_id) REFERENCES usuarios(id)
);

-- Dados iniciais para teste

INSERT INTO usuarios (nome, email, senha, perfil) VALUES
('Ana Paula Silva', 'ana.bibliotecaria@biblioteca.com', 'senha123', 'bibliotecario'),
('Carlos Eduardo Santos', 'carlos.leitor@email.com', 'senha123', 'leitor'),
('Fernanda Lima Oliveira', 'fernanda@email.com', 'senha123', 'leitor'),
('Roberto Almeida Costa', 'roberto@email.com', 'senha123', 'leitor'),
('Mariana Souza Pereira', 'mariana@email.com', 'senha123', 'leitor');

INSERT INTO livros (titulo, autor, ano_publicacao, quantidade_disponivel) VALUES
INSERT INTO livros (titulo, autor, ano_publicacao, quantidade_disponivel) VALUES
('Dom Casmurro', 'Machado de Assis', 1899, 5),
('Memórias Póstumas de Brás Cubas', 'Machado de Assis', 1881, 3),
('O Alquimista', 'Paulo Coelho', 1988, 8),
('Grande Sertão: Veredas', 'João Guimarães Rosa', 1956, 2),
('Vidas Secas', 'Graciliano Ramos', 1938, 4),
('Capitães da Areia', 'Jorge Amado', 1937, 6),
('A Hora da Estrela', 'Clarice Lispector', 1977, 3),
('1984', 'George Orwell', 1949, 7),
('A Revolução dos Bichos', 'George Orwell', 1945, 5),
('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 1943, 10),
('Dom Quixote', 'Miguel de Cervantes', 1605, 2),
('Cem Anos de Solidão', 'Gabriel García Márquez', 1967, 4),
('O Hobbit', 'J.R.R. Tolkien', 1937, 6),
('O Senhor dos Anéis: A Sociedade do Anel', 'J.R.R. Tolkien', 1954, 4),
('Código Limpo', 'Robert C. Martin', 2008, 3),
('O Programador Pragmático', 'David Thomas', 1999, 2),
('Introdução à Algoritmos', 'Cormen et al.', 2009, 1),
('Arquitetura de Software', 'Martin Fowler', 2002, 2),
('Python para Análise de Dados', 'Wes McKinney', 2017, 4),
('JavaScript: O Guia Definitivo', 'David Flanagan', 2020, 3);

INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status) VALUES
-- Empréstimos Realmente Ativos (Dentro do prazo atual)
(1, 2, '2026-06-10', '2026-06-24', 'ativo'),
(4, 2, '2026-06-12', '2026-06-26', 'ativo'),
(3, 3, '2026-06-11', '2026-06-25', 'ativo'),
(7, 3, '2026-06-14', '2026-06-28', 'ativo'),
(9, 4, '2026-06-13', '2026-06-27', 'ativo'),

-- Empréstimos Atrasados (Passaram da data prevista e não têm data_devolucao_real)
(8, 2, '2026-05-10', '2026-05-24', 'atrasado'),
(15, 3, '2026-05-12', '2026-05-26', 'atrasado'),
(13, 4, '2026-05-15', '2026-05-29', 'atrasado'),
(10, 4, '2026-05-20', '2026-06-03', 'atrasado');

-- Empréstimos já Devolvidos (Com a data_devolucao_real preenchida)
INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, data_devolucao_real, status) VALUES
(5, 5, '2026-05-15', '2026-05-29', '2026-05-28', 'devolvido'),
(11, 5, '2026-05-20', '2026-06-03', '2026-06-01', 'devolvido'),
(16, 2, '2026-05-10', '2026-05-24', '2026-05-22', 'devolvido');