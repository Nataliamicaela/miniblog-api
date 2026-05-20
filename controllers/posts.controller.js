// Controllers for posts endpoints
const postsService = require('../services/posts.service');

// ==============================
// GET -> Obtener todos los posts
// ==============================
const getAllPosts = async (req, res, next) => {

  try {

    const posts = await postsService.getAllPosts();

    res.json(posts);

  } catch (error) {

    next(error);
  }
};


// ==============================
// GET -> Obtener post por ID
// ==============================
const getPostById = async (req, res, next) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid post ID'
    });
  }

  try {

    const post = await postsService.getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    res.json(post);

  } catch (error) {

    next(error);
  }
};


// ==============================
// GET -> Obtener posts por autor
// ==============================
const getPostsByAuthor = async (req, res, next) => {

  const authorId = parseInt(req.params.authorId);

  if (isNaN(authorId)) {
    return res.status(400).json({
      error: 'Invalid author ID'
    });
  }

  try {

    const posts = await postsService.getPostsByAuthor(authorId);

    if (posts.length === 0) {
      return res.status(404).json({
        error: 'No posts found for this author'
      });
    }

    res.json(posts);

  } catch (error) {

    next(error);
  }
};


// ==============================
// POST -> Crear nuevo post
// ==============================
const createPost = async (req, res, next) => {

  const { title, content, author_id, published } = req.body;

  if (!title || !content || !author_id) {
    return res.status(400).json({
      error: 'Title, content and author_id are required'
    });
  }

  try {

    const post = await postsService.createPost({
      title,
      content,
      author_id,
      published
    });

    res.status(201).json(post);

  } catch (error) {

    next(error);
  }
};


// ==============================
// PUT -> Actualizar post
// ==============================
const updatePost = async (req, res, next) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid post ID'
    });
  }

  const { title, content, author_id, published } = req.body;

  try {

    const post = await postsService.updatePost(id, {
      title,
      content,
      author_id,
      published
    });

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    res.json(post);

  } catch (error) {

    next(error);
  }
};


// ==============================
// DELETE -> Eliminar post
// ==============================
const deletePost = async (req, res, next) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid post ID'
    });
  }

  try {

    const deleted = await postsService.deletePost(id);

    if (!deleted) {
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
  getPostById,
  getPostsByAuthor,
  createPost,
  updatePost,
  deletePost
};