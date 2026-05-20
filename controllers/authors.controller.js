// Controllers for authors endpoints
const authorsService = require('../services/authors.service');

// ==============================
// GET -> Obtener todos los autores
// ==============================
const getAllAuthors = async (req, res, next) => {
  try {

    const authors = await authorsService.getAllAuthors();

    res.json(authors);

  } catch (error) {

    next(error);
  }
};


// ==============================
// GET -> Obtener autor por ID
// ==============================
const getAuthorById = async (req, res, next) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid author ID'
    });
  }

  try {

    const author = await authorsService.getAuthorById(id);

    if (!author) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    res.json(author);

  } catch (error) {

    next(error);
  }
};


// ==============================
// POST -> Crear nuevo autor
// ==============================
const createAuthor = async (req, res, next) => {

  const { name, email, bio } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      error: 'Name and email are required'
    });
  }

  try {

    const author = await authorsService.createAuthor({
      name,
      email,
      bio
    });

    res.status(201).json(author);

  } catch (error) {

    next(error);
  }
};


// ==============================
// PUT -> Actualizar autor
// ==============================
const updateAuthor = async (req, res, next) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid author ID'
    });
  }

  const { name, email, bio } = req.body;

  try {

    const author = await authorsService.updateAuthor(id, {
      name,
      email,
      bio
    });

    if (!author) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    res.json(author);

  } catch (error) {

    next(error);
  }
};


// ==============================
// DELETE -> Eliminar autor
// ==============================
const deleteAuthor = async (req, res, next) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid author ID'
    });
  }

  try {

    const deleted = await authorsService.deleteAuthor(id);

    if (!deleted) {
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