const request = require('supertest');
const { app, server } = require('../app');

describe('API Routes', () => {
  afterAll(async () => {
    await server.close();
  });

  describe('GET /api/v1/data', () => {
    it('should return unauthorized without API key', async () => {
      await request(app)
        .get('/api/v1/data')
        .expect(401);
    });

    it('should return data with valid API key', async () => {
      const response = await request(app)
        .get('/api/v1/data')
        .set('X-API-Key', 'local-api-key')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('name', 'Sample Data');
    });
  });

  describe('POST /api/v1/echo', () => {
    it('should echo back the message', async () => {
      const testMessage = 'Hello, World!';
      const response = await request(app)
        .post('/api/v1/echo')
        .send({ message: testMessage })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('echo', testMessage);
    });

    it('should return validation error for empty message', async () => {
      await request(app)
        .post('/api/v1/echo')
        .send({})
        .expect(400);
    });
  });
});
