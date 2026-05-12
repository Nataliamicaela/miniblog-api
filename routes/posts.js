const express = require('express');
const router = express.Router();

const pool = require('../db/config');

// GET all posts
router.get('/', async (req, res) => {

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

    console.error(error);

    res.status(500).json({
      error: 'Error fetching posts'
    });

  }

});

// GET posts by author
router.get('/author/:authorId', async (req, res) => {

  const { authorId } = req.params;

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

    console.error(error);

    res.status(500).json({
      error: 'Error fetching author posts'
    });

  }

});

// GET post by id
router.get('/:id', async (req, res) => {

  const { id } = req.params;

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

    console.error(error);

    res.status(500).json({
      error: 'Error fetching post'
    });

  }

});

// CREATE post
router.post('/', async (req, res) => {

  const {
    title,
    content,
    author_id,
    published
  } = req.body;

  // Validations
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

      [
        title,
        content,
        author_id,
        published || false
      ]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Error creating post'
    });

  }

});

// UPDATE post
router.put('/:id', async (req, res) => {

  const { id } = req.params;

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

      [
        title,
        content,
        author_id,
        published,
        id
      ]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: 'Post not found'
      });

    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Error updating post'
    });

  }

});

// DELETE post
router.delete('/:id', async (req, res) => {

  const { id } = req.params;

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

    console.error(error);

    res.status(500).json({
      error: 'Error deleting post'
    });

  }

});

module.exports = router;