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

jest.unstable_mockModule('../config/cloudinary.js', () => ({
  default: jest.fn()
}));

const mockUploadFile = jest.fn((req, res) => res.status(201).json({ message: "Mocked upload success!" }));
const mockGetFiles = jest.fn((req, res) => res.status(200).json({ files: [] }));
const mockDeleteFile = jest.fn((req, res) => res.status(200).json({ message: "Mocked delete success!" }));

jest.unstable_mockModule('../controllers/fileController.js', () => ({
  uploadFile: mockUploadFile,
  getFiles: mockGetFiles,
  deleteFile: mockDeleteFile,
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { verify: jest.fn().mockReturnValue({ id: 'fileTesterId' }) }
}));

jest.unstable_mockModule('../models/userModel.js', () => ({
  default: {
    findById: jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ _id: 'fileTesterId' })
    })
  }
}));

const { default: request } = await import('supertest');
const { default: app } = await import('../app.js');

describe('File Upload API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/files - should return 401 if no validation token is passed', async () => {
    const res = await request(app).get('/api/files');
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/files - should respond with a 200 array when authorized', async () => {
    const res = await request(app)
      .get('/api/files')
      .set('Authorization', 'Bearer dummy-token');

    expect(res.statusCode).toBe(200);
    expect(mockGetFiles).toHaveBeenCalled();
  });

  it('POST /api/files/upload - should accept and parse allowed mimetype files (.pdf)', async () => {
    const dummyPdfBuffer = Buffer.from('%PDF-1.4 dummy contents');

    const res = await request(app)
      .post('/api/files/upload')
      .set('Authorization', 'Bearer dummy-token')
      .attach('file', dummyPdfBuffer, { filename: 'syllabus.pdf', contentType: 'application/pdf' });

    expect(res.statusCode).toBe(201);
    expect(mockUploadFile).toHaveBeenCalled();
  });

  it('POST /api/files/upload - should block prohibited files (.png) at middleware layer', async () => {
    const dummyImageBuffer = Buffer.from('fake image content');

    const res = await request(app)
      .post('/api/files/upload')
      .set('Authorization', 'Bearer dummy-token')
      .attach('file', dummyImageBuffer, { filename: 'avatar.png', contentType: 'image/png' });

    
    expect([400, 500]).toContain(res.statusCode);
    expect(mockUploadFile).not.toHaveBeenCalled();
  });
});