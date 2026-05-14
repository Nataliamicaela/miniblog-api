TRUNCATE comments, posts, authors RESTART IDENTITY CASCADE;

INSERT INTO authors (name, email, bio) VALUES

('Ana García', 'ana@example.com', 'Desarrolladora full-stack apasionada por Node.js'),
('Carlos Ruiz', 'carlos@example.com', 'Escritor técnico especializado en bases de datos'),
('María López', 'maria@example.com', 'Ingeniera de software con foco en APIs REST');

INSERT INTO posts (title, content, author_id, published) VALUES

('Introducción a Node.js', 'Node.js es un runtime de JavaScript...', 1, true),
('PostgreSQL vs MySQL', 'Ambas bases de datos tienen ventajas...', 2, true),
('APIs RESTful', 'REST es un estilo arquitectónico...', 1, true),
('Manejo de errores en Express', 'El manejo apropiado de errores...', 3, false),
('Async/Await explicado', 'Las promesas simplifican el código asíncrono...', 1, false);

INSERT INTO comments (post_id, author_id, content) VALUES

(1, 2, 'Excelente introducción, muy clara y concisa.'),
(1, 3, 'Me ayudó mucho para entender los conceptos básicos.'),
(2, 1, 'Muy buen análisis comparativo entre ambas bases de datos.'),
(3, 2, 'REST es fundamental, buen artículo.'),
(3, 3, 'Muy útil para entender la arquitectura de APIs.');