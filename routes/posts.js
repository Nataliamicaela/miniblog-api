const express = require('express');
const router = express.Router();

const {
  getAllPosts,
  getPostsByAuthor,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/posts.controller');

router.get('/', getAllPosts);
router.get('/author/:authorId', getPostsByAuthor);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;