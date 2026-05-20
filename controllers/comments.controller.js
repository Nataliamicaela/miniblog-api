// Controllers for comments endpoints
const commentsService = require('../services/comments.service');

// ==============================
// GET -> Obtener todos los comentarios
// ==============================
const getAllComments = async (req, res, next) => {
  try {

    const comments = await commentsService.getAllComments();

    res.json(comments);

  } catch (error) {

    next(error);
  }
};


// ==============================
// GET -> Obtener comentario por ID
// ==============================
const getCommentById = async (req, res, next) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid comment ID'
    });
  }

  try {

    const comment = await commentsService.getCommentById(id);

    if (!comment) {
      return res.status(404).json({
        error: 'Comment not found'
      });
    }

    res.json(comment);

  } catch (error) {

    next(error);
  }
};


// ==============================
// GET -> Obtener comentarios por post
// ==============================
const getCommentsByPost = async (req, res, next) => {

  const postId = parseInt(req.params.postId);

  if (isNaN(postId)) {
    return res.status(400).json({
      error: 'Invalid post ID'
    });
  }

  try {

    const comments = await commentsService.getCommentsByPost(postId);

    if (comments.length === 0) {
      return res.status(404).json({
        error: 'No comments found for this post'
      });
    }

    res.json(comments);

  } catch (error) {

    next(error);
  }
};


// ==============================
// POST -> Crear nuevo comentario
// ==============================
const createComment = async (req, res, next) => {

  const { post_id, author_id, content } = req.body;

  if (!post_id || !author_id || !content) {
    return res.status(400).json({
      error: 'post_id, author_id and content are required'
    });
  }

  try {

    const comment = await commentsService.createComment({
      post_id,
      author_id,
      content
    });

    res.status(201).json(comment);

  } catch (error) {

    next(error);
  }
};


// ==============================
// DELETE -> Eliminar comentario
// ==============================
const deleteComment = async (req, res, next) => {

  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      error: 'Invalid comment ID'
    });
  }

  try {

    const deleted = await commentsService.deleteComment(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Comment not found'
      });
    }

    res.status(204).send();

  } catch (error) {

    next(error);
  }
};


module.exports = {
  getAllComments,
  getCommentById,
  getCommentsByPost,
  createComment,
  deleteComment
};