// Services for posts queries
const pool = require('../db/config');

// ==============================
// Base query for posts
// ==============================
const SELECT_POSTS = `
  SELECT
    posts.id,
    posts.title,
    posts.content,
    posts.published,
    posts.created_at,
    authors.name AS author_name,
    authors.email AS author_email
  FROM posts
  JOIN authors
    ON posts.author_id = authors.id
`;


// ==============================
// GET -> Obtener todos los posts
// ==============================
const getAllPosts = async () => {

  const result = await pool.query(
    SELECT_POSTS + ' ORDER BY posts.id'
  );

  return result.rows;
};


// ==============================
// GET -> Obtener post por ID
// ==============================
const getPostById = async (id) => {

  const result = await pool.query(
    SELECT_POSTS + ' WHERE posts.id = $1',
    [id]
  );

  return result.rows[0] || null;
};


// ==============================
// GET -> Obtener posts por autor
// ==============================
const getPostsByAuthor = async (authorId) => {

  const result = await pool.query(
    SELECT_POSTS + ' WHERE authors.id = $1 ORDER BY posts.id',
    [authorId]
  );

  return result.rows;
};


// ==============================
// POST -> Crear nuevo post
// ==============================
const createPost = async ({
  title,
  content,
  author_id,
  published
}) => {

  const result = await pool.query(
    `
      INSERT INTO posts (
        title,
        content,
        author_id,
        published
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [title, content, author_id, published ?? false]
  );

  return result.rows[0];
};


// ==============================
// PUT -> Actualizar post
// ==============================
const updatePost = async (
  id,
  {
    title,
    content,
    author_id,
    published
  }
) => {

  const result = await pool.query(
    `
      UPDATE posts
      SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        author_id = COALESCE($3, author_id),
        published = COALESCE($4, published)
      WHERE id = $5
      RETURNING *
    `,
    [title, content, author_id, published, id]
  );

  return result.rows[0] || null;
};


// ==============================
// DELETE -> Eliminar post
// ==============================
const deletePost = async (id) => {

  const result = await pool.query(
    'DELETE FROM posts WHERE id = $1 RETURNING *',
    [id]
  );

  return result.rows[0] || null;
};


module.exports = {
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost
};