const request = require('supertest');

const app = require('../app');

const pool = require('../db/config');

describe('Posts endpoints', () => {

  test('GET /posts should return all posts', async () => {

    const response = await request(app)
      .get('/posts');

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body))
      .toBe(true);

  });

  test('GET /posts/:id should return 404 if post does not exist', async () => {

    const response = await request(app)
      .get('/posts/999999');

    expect(response.statusCode).toBe(404);

    expect(response.body.error)
      .toBe('Post not found');

  });

  test('POST /posts should create a new post', async () => {

  const newAuthor = {
    name: 'Post Author',
    email: `post${Date.now()}@email.com`
  };

  const createdAuthor = await request(app)
    .post('/authors')
    .send(newAuthor);

  const newPost = {
    title: 'Test Post',
    content: 'Post content',
    author_id: createdAuthor.body.id
  };

  const response = await request(app)
    .post('/posts')
    .send(newPost);

  expect(response.statusCode).toBe(201);

  expect(response.body.title)
    .toBe(newPost.title);

  });

  test('PUT /posts/:id should update a post', async () => {

  const newAuthor = {
    name: 'Update Post Author',
    email: `updatepost${Date.now()}@email.com`
  };

  const createdAuthor = await request(app)
    .post('/authors')
    .send(newAuthor);

  const newPost = {
    title: 'Original Title',
    content: 'Original content',
    author_id: createdAuthor.body.id
  };

  const createdPost = await request(app)
    .post('/posts')
    .send(newPost);

  const updatedData = {
    title: 'Updated Title'
  };

  const response = await request(app)
    .put(`/posts/${createdPost.body.id}`)
    .send(updatedData);

  expect(response.statusCode).toBe(200);

  expect(response.body.title)
    .toBe(updatedData.title);

  });

  test('DELETE /posts/:id should delete a post', async () => {

  const newAuthor = {
    name: 'Delete Post Author',
    email: `deletepost${Date.now()}@email.com`
  };

  const createdAuthor = await request(app)
    .post('/authors')
    .send(newAuthor);

  const newPost = {
    title: 'Delete Post',
    content: 'Delete content',
    author_id: createdAuthor.body.id
  };

  const createdPost = await request(app)
    .post('/posts')
    .send(newPost);

  const response = await request(app)
    .delete(`/posts/${createdPost.body.id}`);

  expect(response.statusCode)
    .toBe(204);

  });

});