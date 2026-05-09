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

module.exports = router;