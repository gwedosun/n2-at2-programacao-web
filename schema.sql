-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;

-- Tabela: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL, -- Aumentado para hash seguro
    perfil ENUM('bibliotecario', 'leitor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela: livros
CREATE TABLE IF NOT EXISTS livros (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    ano_publicacao INT,
    quantidade_disponivel INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CHECK (quantidade_disponivel >= 0)
);

-- Tabela: emprestimos
CREATE TABLE IF NOT EXISTS emprestimos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    livro_id INT NOT NULL,
    leitor_id INT NOT NULL,
    data_emprestimo DATE NOT NULL,
    data_devolucao_prevista DATE NOT NULL,
    data_devolucao_real DATE,
    status ENUM('ativo', 'devolvido', 'atrasado') DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE RESTRICT,
    FOREIGN KEY (leitor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_leitor (leitor_id),
    INDEX idx_livro (livro_id)
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

-- Inserir alguns empréstimos de exemplo
INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, status) VALUES
-- Empréstimos ativos
(1, 2, '2024-11-01', '2024-11-15', 'ativo'),
(4, 2, '2024-11-05', '2024-11-19', 'ativo'),
(8, 2, '2024-11-10', '2024-11-24', 'ativo'),
(3, 3, '2024-11-02', '2024-11-16', 'ativo'),
(7, 3, '2024-11-08', '2024-11-22', 'ativo'),
(15, 3, '2024-11-12', '2024-11-26', 'ativo'),
(9, 4, '2024-11-03', '2024-11-17', 'ativo'),
(13, 4, '2024-10-25', '2024-11-08', 'ativo'),
(10, 4, '2024-10-20', '2024-11-03', 'ativo');

INSERT INTO emprestimos (livro_id, leitor_id, data_emprestimo, data_devolucao_prevista, data_devolucao_real, status) VALUES
(5, 5, '2024-10-15', '2024-10-29', '2024-10-28', 'devolvido'),
(11, 5, '2024-10-20', '2024-11-03', '2024-11-01', 'devolvido'),
(16, 2, '2024-10-10', '2024-10-24', '2024-10-22', 'devolvido');

-- View para listar empréstimos com detalhes (útil para queries)
CREATE OR REPLACE VIEW vw_emprestimos_detalhes AS
SELECT 
    e.id,
    l.titulo as livro_titulo,
    l.autor as livro_autor,
    u.nome as leitor_nome,
    u.email as leitor_email,
    e.data_emprestimo,
    e.data_devolucao_prevista,
    e.data_devolucao_real,
    e.status,
    CASE 
        WHEN e.status = 'ativo' AND e.data_devolucao_prevista < CURDATE() THEN 'atrasado'
        ELSE e.status
    END as status_atual
FROM emprestimos e
JOIN livros l ON e.livro_id = l.id
JOIN usuarios u ON e.leitor_id = u.id;