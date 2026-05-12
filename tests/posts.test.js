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

});