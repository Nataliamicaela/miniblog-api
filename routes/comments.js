const express = require('express');
const router = express.Router();

const {
  getAllComments,
  getCommentById,
  getCommentsByPost,
  createComment,
  deleteComment
} = require('../controllers/comments');

router.get('/', getAllComments);
router.get('/post/:postId', getCommentsByPost);
router.get('/:id', getCommentById);
router.post('/', createComment);
router.delete('/:id', deleteComment);

module.exports = router;