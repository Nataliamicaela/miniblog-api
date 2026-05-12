const express = require('express');

const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);

// Home route
app.get('/', (req, res) => {

  res.json({
    message: 'MiniBlog API'
  });

});

// 404 handler
app.use((req, res) => {

  res.status(404).json({
    error: 'Route not found'
  });

});

module.exports = app;