import { jest } from '@jest/globals';


const mockQueryChain = {
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  populate: jest.fn().mockReturnThis(),
 
  then: function(onFulfilled) {
    return Promise.resolve([
      { _id: 'msg123', content: 'Hey there!', sender: { _id: 'friend1' }, receiver: { _id: 'user123' } }
    ]).then(onFulfilled);
  }
};

const mockUpdateMany = jest.fn().mockResolvedValue({ modifiedCount: 1 });
const mockCountDocuments = jest.fn().mockResolvedValue(0);

jest.unstable_mockModule('../models/messageModel.js', () => ({
  default: {
    find: jest.fn().mockReturnValue(mockQueryChain),
    updateMany: mockUpdateMany,
    countDocuments: mockCountDocuments
  }
}));

jest.unstable_mockModule('../models/fileModel.js', () => ({
  default: {
    find: jest.fn().mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([])
    })
  }
}));


jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { verify: jest.fn().mockReturnValue({ id: 'user123' }) }
}));
jest.unstable_mockModule('../models/userModel.js', () => ({
  default: { findById: jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'user123' }) }) }
}));

const { default: request } = await import('supertest');
const { default: app } = await import('../app.js');

describe('Chat REST API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/chat/:friendId - fetches history and reverses chronological order for UI', async () => {
    const res = await request(app)
      .get('/api/chat/friend1')
      .set('Authorization', 'Bearer valid-token');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('messages');
    expect(Array.isArray(res.body.messages)).toBe(true);
  });

  it('PUT /api/chat/:friendId/read - marks messages as read successfully', async () => {
    const res = await request(app)
      .put('/api/chat/friend1/read')
      .set('Authorization', 'Bearer valid-token');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Messages marked as read.');
    expect(mockUpdateMany).toHaveBeenCalled();
  });

  it('GET /api/chat/conversations - builds a deduplicated conversation list', async () => {
    const res = await request(app)
      .get('/api/chat/conversations')
      .set('Authorization', 'Bearer valid-token');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('conversations');
  });
});