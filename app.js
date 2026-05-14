const path = require('path');
const express = require('express');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const authorsRouter = require('./routes/authors');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');

const app = express();

const swaggerDocument = YAML.load(
  path.join(__dirname, './docs/swagger.yaml')
);

// Middleware
app.use(express.json());

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Routes
app.use('/authors', authorsRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

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