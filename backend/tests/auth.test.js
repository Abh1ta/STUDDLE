import { jest } from '@jest/globals';

jest.unstable_mockModule('mongoose', () => ({
  default: {
    connect: jest.fn().mockResolvedValue(true),
    connection: { on: jest.fn() },
    models: {},
    Schema: class Schema {
      static Types = { ObjectId: String, Mixed: Object }
      constructor() {}
      pre() { return this; }
      index() { return this; }
    },
    model: jest.fn().mockReturnValue({}),
  }
}));

const { default: request } = await import('supertest');
const { default: app } = await import('../app.js');

describe('Auth Routes', () => {
  it('POST /api/auth/register - missing fields returns 400', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.statusCode).toBe(400);
  }, 10000);

  it('POST /api/auth/login - wrong credentials returns 401 or 400', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'fake@fake.com', password: 'wrongpass' });
    expect([400, 401]).toContain(res.statusCode);
  }, 10000);

  afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
  });
});