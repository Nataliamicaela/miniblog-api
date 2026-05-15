const request = require('supertest');

const app = require('../app');

describe('Comments endpoints', () => {

  test('GET /comments should return all comments', async () => {

    const response = await request(app)
      .get('/comments');

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body))
      .toBe(true);

  });

  test('GET /comments/:id should return 400 for invalid ID', async () => {

    const response = await request(app)
      .get('/comments/abc');

    expect(response.statusCode).toBe(400);

    expect(response.body.error)
      .toBe('Invalid comment ID');

  });

  test('GET /comments/:id should return 404 if comment does not exist', async () => {

    const response = await request(app)
      .get('/comments/999999');

    expect(response.statusCode).toBe(404);

    expect(response.body.error)
      .toBe('Comment not found');

  });

  test('POST /comments should return 400 if required fields are missing', async () => {

    const invalidComment = {
      content: 'Missing post_id and author_id'
    };

    const response = await request(app)
      .post('/comments')
      .send(invalidComment);

    expect(response.statusCode).toBe(400);

    expect(response.body.error)
      .toBe('post_id, author_id and content are required');

  });

  test('POST /comments should return 400 if post or author does not exist', async () => {

    const invalidComment = {
      post_id: 999999,
      author_id: 999999,
      content: 'Testing FK violation'
    };

    const response = await request(app)
      .post('/comments')
      .send(invalidComment);

    expect(response.statusCode).toBe(400);

    expect(response.body.error)
      .toBe('Related resource does not exist');

  });

  test('POST /comments should create a new comment', async () => {

    // Crear autor
    const newAuthor = {
      name: 'Comment Author',
      email: `comment${Date.now()}@email.com`
    };

    const createdAuthor = await request(app)
      .post('/authors')
      .send(newAuthor);

    // Crear post
    const newPost = {
      title: 'Post for comment',
      content: 'Post content',
      author_id: createdAuthor.body.id
    };

    const createdPost = await request(app)
      .post('/posts')
      .send(newPost);

    // Crear comentario
    const newComment = {
      post_id: createdPost.body.id,
      author_id: createdAuthor.body.id,
      content: 'This is a test comment'
    };

    const response = await request(app)
      .post('/comments')
      .send(newComment);

    expect(response.statusCode).toBe(201);

    expect(response.body.content)
      .toBe(newComment.content);

  });

  test('GET /comments/post/:postId should return 400 for invalid ID', async () => {

    const response = await request(app)
      .get('/comments/post/abc');

    expect(response.statusCode).toBe(400);

    expect(response.body.error)
      .toBe('Invalid post ID');

  });

  test('GET /comments/post/:postId should return 404 if no comments found', async () => {

    const response = await request(app)
      .get('/comments/post/999999');

    expect(response.statusCode).toBe(404);

    expect(response.body.error)
      .toBe('No comments found for this post');

  });

  test('DELETE /comments/:id should delete a comment', async () => {

    // Crear autor
    const newAuthor = {
      name: 'Delete Comment Author',
      email: `deletecomment${Date.now()}@email.com`
    };

    const createdAuthor = await request(app)
      .post('/authors')
      .send(newAuthor);

    // Crear post
    const newPost = {
      title: 'Post for delete comment',
      content: 'Post content',
      author_id: createdAuthor.body.id
    };

    const createdPost = await request(app)
      .post('/posts')
      .send(newPost);

    // Crear comentario
    const newComment = {
      post_id: createdPost.body.id,
      author_id: createdAuthor.body.id,
      content: 'Comment to delete'
    };

    const createdComment = await request(app)
      .post('/comments')
      .send(newComment);

    // Eliminar comentario
    const response = await request(app)
      .delete(`/comments/${createdComment.body.id}`);

    expect(response.statusCode).toBe(204);

  });

});