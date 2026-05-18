import { jest } from '@jest/globals';


const mockFindById = jest.fn();
jest.unstable_mockModule('../models/userModel.js', () => ({
  default: {
    findById: mockFindById
  }
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn()
  }
}));

// 2. Dynamic imports required for ES Modules
const { protect } = await import('../middleware/authMiddleware.js');
const { default: jwt } = await import('jsonwebtoken');

describe('Protect Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should return 401 if no authorization header is provided', async () => {
    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token provided." });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the token is invalid or expired', async () => {
    req.headers.authorization = 'Bearer bad-token';
  
    jwt.verify.mockImplementation(() => { throw new Error('jwt expired'); });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token." });
    expect(next).not.toHaveBeenCalled();
  });

  it('should pass to next middleware and attach user data if token is valid', async () => {
    req.headers.authorization = 'Bearer good-token';
    jwt.verify.mockReturnValue({ id: 'mockedUserId123' });
    

    const mockSelect = jest.fn().mockResolvedValue({ 
      _id: { toString: () => 'mockedUserId123' },
      username: 'testuser'
    });
    mockFindById.mockReturnValue({ select: mockSelect });

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('good-token', process.env.JWT_SECRET);
    expect(mockFindById).toHaveBeenCalledWith('mockedUserId123');
    expect(req.userId).toBe('mockedUserId123');
    expect(next).toHaveBeenCalled();
  });
});