const express = require('express');
const router = express.Router();

const pool = require('../db/config');

// GET all authors
router.get('/', async (req, res) => {

  try {

    const result = await pool.query(
      'SELECT * FROM authors ORDER BY id'
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Error fetching authors'
    });

  }

});

// GET author by id
router.get('/:id', async (req, res) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {

    return res.status(400).json({
      error: 'Invalid author ID'
    });

  }

  try {

    const result = await pool.query(
      'SELECT * FROM authors WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: 'Author not found'
      });

    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Error fetching author'
    });

  }

});

// CREATE author
router.post('/', async (req, res) => {

  const { name, email, bio } = req.body;

  // Validations
  if (!name || !email) {

    return res.status(400).json({
      error: 'Name and email are required'
    });

  }

  try {

    const result = await pool.query(

      `INSERT INTO authors
      (name, email, bio)
      VALUES ($1, $2, $3)
      RETURNING *`,

      [name, email, bio || null]

    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    // Unique email validation
    if (error.code === '23505') {

      return res.status(400).json({
        error: 'Email already exists'
      });

    }

    res.status(500).json({
      error: 'Error creating author'
    });

  }

});

// UPDATE author
router.put('/:id', async (req, res) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {

    return res.status(400).json({
      error: 'Invalid author ID'
    });

  }

  const { name, email, bio } = req.body;

  try {

    const result = await pool.query(

      `UPDATE authors
      SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        bio = COALESCE($3, bio)
      WHERE id = $4
      RETURNING *`,

      [name, email, bio, id]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: 'Author not found'
      });

    }

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    if (error.code === '23505') {

      return res.status(400).json({
        error: 'Email already exists'
      });

    }

    res.status(500).json({
      error: 'Error updating author'
    });

  }

});

// DELETE author
router.delete('/:id', async (req, res) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {

    return res.status(400).json({
      error: 'Invalid author ID'
    });

  }

  try {

    const result = await pool.query(

      'DELETE FROM authors WHERE id = $1 RETURNING *',

      [id]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        error: 'Author not found'
      });

    }

    res.status(204).send();

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Error deleting author'
    });

  }

});

module.exports = router;