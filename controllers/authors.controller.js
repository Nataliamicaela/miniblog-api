const pool = require('../db/config');

// GET all authors
const getAllAuthors = async (
    req,
    res,
    next
) => {

    try {

        const result = await pool.query(
            'SELECT * FROM authors ORDER BY id'
        );

        res.json(result.rows);

    } catch (error) {

        next(error);

    }

};

// GET author by id
const getAuthorById = async (
    req,
    res,
    next
) => {

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

        next(error);

    }

};

// CREATE author
const createAuthor = async (
    req,
    res,
    next
) => {

    const { name, email, bio } = req.body;

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

        next(error);

    }

};

// UPDATE author
const updateAuthor = async (
    req,
    res,
    next
) => {

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

        next(error);

    }

};

// DELETE author
const deleteAuthor = async (
    req,
    res,
    next
) => {

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

        next(error);

    }

};

module.exports = {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
};