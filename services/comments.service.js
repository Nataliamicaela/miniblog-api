// Services for comments queries
const pool = require('../db/config');

// ==============================
// Base query for comments
// ==============================
const SELECT_COMMENTS = `
  SELECT
    comments.id,
    comments.content,
    comments.created_at,
    posts.title AS post_title,
    authors.name AS author_name,
    authors.email AS author_email
  FROM comments
  JOIN posts
    ON comments.post_id = posts.id
  JOIN authors
    ON comments.author_id = authors.id
`;


// ==============================
// GET -> Obtener todos los comentarios
// ==============================
const getAllComments = async () => {

  const result = await pool.query(
    SELECT_COMMENTS + ' ORDER BY comments.id'
  );

  return result.rows;
};


// ==============================
// GET -> Obtener comentario por ID
// ==============================
const getCommentById = async (id) => {

  const result = await pool.query(
    SELECT_COMMENTS + ' WHERE comments.id = $1',
    [id]
  );

  return result.rows[0] || null;
};


// ==============================
// GET -> Obtener comentarios por post
// ==============================
const getCommentsByPost = async (postId) => {

  const result = await pool.query(
    SELECT_COMMENTS + ' WHERE comments.post_id = $1 ORDER BY comments.id',
    [postId]
  );

  return result.rows;
};


// ==============================
// POST -> Crear nuevo comentario
// ==============================
const createComment = async ({ post_id, author_id, content }) => {

  const result = await pool.query(
    `
      INSERT INTO comments (post_id, author_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
    [post_id, author_id, content]
  );

  return result.rows[0];
};


// ==============================
// DELETE -> Eliminar comentario
// ==============================
const deleteComment = async (id) => {

  const result = await pool.query(
    'DELETE FROM comments WHERE id = $1 RETURNING *',
    [id]
  );

  return result.rows[0] || null;
};


module.exports = {
  getAllComments,
  getCommentById,
  getCommentsByPost,
  createComment,
  deleteComment
};