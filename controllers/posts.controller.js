const pool = require('../db/config');

// GET all posts
const getAllPosts = async (
  req,
  res,
  next
) => {

  try {

    const result = await pool.query(

      `SELECT
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
      ORDER BY posts.id`

    );

    res.json(result.rows);

  } catch (error) {

    next(error);

  }

};

// GET posts by author
const getPostsByAuthor = async (
  req,
  res,
  next
) => {

  const authorId = parseInt(req.params.authorId);

  if (isNaN(authorId)) {

    return res.status(400).json({
      error: 'Invalid author ID'
    });

  }

  try {

    const result = await pool.query(

      `SELECT
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
      WHERE authors.id = $1
      ORDER BY posts.id`,

      [authorId]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: 'No posts found for this author'
      });

    }

    res.json(result.rows);

  } catch (error) {

    next(error);

  }

};

// GET post by id
const getPostById = async (
  req,
  res,
  next
) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {

    return res.status(400).json({
      error: 'Invalid post ID'
    });

  }

  try {

    const result = await pool.query(

      `SELECT
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
      WHERE posts.id = $1`,

      [id]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: 'Post not found'
      });

    }

    res.json(result.rows[0]);

  } catch (error) {

    next(error);

  }

};

// CREATE post
const createPost = async (
  req,
  res,
  next
) => {

  const {
    title,
    content,
    author_id,
    published
  } = req.body;

  if (!title || !content || !author_id) {

    return res.status(400).json({
      error: 'Title, content and author_id are required'
    });

  }

  try {

    const result = await pool.query(

      `INSERT INTO posts
      (title, content, author_id, published)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,

      [title, content, author_id, published ?? false]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    next(error);

  }

};

// UPDATE post
const updatePost = async (
  req,
  res,
  next
) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {

    return res.status(400).json({
      error: 'Invalid post ID'
    });

  }

  const {
    title,
    content,
    author_id,
    published
  } = req.body;

  try {

    const result = await pool.query(

      `UPDATE posts
      SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        author_id = COALESCE($3, author_id),
        published = COALESCE($4, published)
      WHERE id = $5
      RETURNING *`,

      [title, content, author_id, published, id]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: 'Post not found'
      });

    }

    res.json(result.rows[0]);

  } catch (error) {

    next(error);

  }

};

// DELETE post
const deletePost = async (
  req,
  res,
  next
) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {

    return res.status(400).json({
      error: 'Invalid post ID'
    });

  }

  try {

    const result = await pool.query(
      'DELETE FROM posts WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: 'Post not found'
      });

    }

    res.status(204).send();

  } catch (error) {

    next(error);

  }

};

module.exports = {
  getAllPosts,
  getPostsByAuthor,
  getPostById,
  createPost,
  updatePost,
  deletePost
};