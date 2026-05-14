const pool = require('../db/config');

// GET all comments
const getAllComments = async (req, res) => {

  try {

    const result = await pool.query(

      `SELECT
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
      ORDER BY comments.id`

    );

    res.json(result.rows);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      error: 'Error fetching comments'
    });

  }

};

// GET comment by id
const getCommentById = async (req, res) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {

    return res.status(400).json({
      error: 'Invalid comment ID'
    });

  }

  try {

    const result = await pool.query(

      `SELECT
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
      WHERE comments.id = $1`,

      [id]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: 'Comment not found'
      });

    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      error: 'Error fetching comment'
    });

  }

};

// GET comments by post
const getCommentsByPost = async (req, res) => {

  const postId = parseInt(req.params.postId);

  if (isNaN(postId)) {

    return res.status(400).json({
      error: 'Invalid post ID'
    });

  }

  try {

    const result = await pool.query(

      `SELECT
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
      WHERE comments.post_id = $1
      ORDER BY comments.id`,

      [postId]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: 'No comments found for this post'
      });

    }

    res.json(result.rows);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      error: 'Error fetching post comments'
    });

  }

};

// CREATE comment
const createComment = async (req, res) => {

  const { post_id, author_id, content } = req.body;

  if (!post_id || !author_id || !content) {

    return res.status(400).json({
      error: 'post_id, author_id and content are required'
    });

  }

  try {

    const result = await pool.query(

      `INSERT INTO comments
      (post_id, author_id, content)
      VALUES ($1, $2, $3)
      RETURNING *`,

      [post_id, author_id, content]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error.message);

    if (error.code === '23503') {

      return res.status(400).json({
        error: 'Post or author does not exist'
      });

    }

    res.status(500).json({
      error: 'Error creating comment'
    });

  }

};

// DELETE comment
const deleteComment = async (req, res) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {

    return res.status(400).json({
      error: 'Invalid comment ID'
    });

  }

  try {

    const result = await pool.query(
      'DELETE FROM comments WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: 'Comment not found'
      });

    }

    res.status(204).send();

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      error: 'Error deleting comment'
    });

  }

};

module.exports = {
  getAllComments,
  getCommentById,
  getCommentsByPost,
  createComment,
  deleteComment
};