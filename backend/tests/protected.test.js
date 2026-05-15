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

const PROTECTED_ROUTES = [
  { method: 'get', path: '/api/friends' },
  { method: 'get', path: '/api/subjects' },
  { method: 'get', path: '/api/homework' },
  { method: 'get', path: '/api/exams' },
];

describe('Protected routes reject unauthenticated requests', () => {
  for (const route of PROTECTED_ROUTES) {
    it(`${route.method.toUpperCase()} ${route.path} returns 401 without token`, async () => {
      const res = await request(app)[route.method](route.path);
      expect(res.statusCode).toBe(401);
    });
  }

  afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
  });
});