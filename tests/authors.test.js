const request = require('supertest');

const app = require('../app');

describe('Authors endpoints', () => {

  test('GET /authors should return all authors', async () => {

    const response = await request(app)
      .get('/authors');

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body))
      .toBe(true);

  });

  test('POST /authors should create a new author', async () => {

    const newAuthor = {
      name: 'Test Author',
      email: `test${Date.now()}@email.com`,
      bio: 'Backend developer'
    };

    const response = await request(app)
      .post('/authors')
      .send(newAuthor);

    expect(response.statusCode).toBe(201);

    expect(response.body.name)
      .toBe(newAuthor.name);

    expect(response.body.email)
      .toBe(newAuthor.email);

  });

  test('POST /authors should return 400 if name is missing', async () => {

  const invalidAuthor = {
    email: `test${Date.now()}@email.com`
  };

  const response = await request(app)
    .post('/authors')
    .send(invalidAuthor);

  expect(response.statusCode).toBe(400);

  expect(response.body.error)
    .toBe('Name and email are required');

  });

  test('GET /authors/:id should return 404 if author does not exist', async () => {

  const response = await request(app)
    .get('/authors/999999');

  expect(response.statusCode).toBe(404);

  expect(response.body.error)
    .toBe('Author not found');

  });

  test('PUT /authors/:id should update an author', async () => {

  const newAuthor = {
    name: 'Author Update',
    email: `update${Date.now()}@email.com`,
    bio: 'Original bio'
  };

  const createdAuthor = await request(app)
    .post('/authors')
    .send(newAuthor);

  const updatedData = {
    name: 'Updated Author'
  };

  const response = await request(app)
    .put(`/authors/${createdAuthor.body.id}`)
    .send(updatedData);

  expect(response.statusCode).toBe(200);

  expect(response.body.name)
    .toBe(updatedData.name);

  });

  test('DELETE /authors/:id should delete an author', async () => {

  const newAuthor = {
    name: 'Delete Author',
    email: `delete${Date.now()}@email.com`
  };

  const createdAuthor = await request(app)
    .post('/authors')
    .send(newAuthor);

  const response = await request(app)
    .delete(`/authors/${createdAuthor.body.id}`);

  expect(response.statusCode)
    .toBe(204);

  });

});