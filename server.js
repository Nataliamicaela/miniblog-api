const { loadEnvFile } = require('node:process');
const express = require('express');

const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');

loadEnvFile('.env');

const app = express();

const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});