import { jest } from '@jest/globals';


const mockCreateMessage = jest.fn();
jest.unstable_mockModule('../models/messageModel.js', () => ({
  default: {
    create: mockCreateMessage,
    updateMany: jest.fn().mockResolvedValue({})
  }
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { verify: jest.fn().mockReturnValue({ id: 'user123', username: 'tester' }) }
}));

const { initSocket } = await import('../socket/socketHandler.js');

describe('Chat Socket.io Event Handlers', () => {
  let mockIo, mockSocket, registeredEvents;

  beforeEach(() => {
    jest.clearAllMocks();
    registeredEvents = {};

  
    mockSocket = {
      handshake: { auth: { token: 'valid-socket-token' } },
      user: { id: 'user123' },
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
      to: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        registeredEvents[event] = callback; // Capture event handlers to fire manually
      })
    };

    mockIo = {
      use: jest.fn((middleware) => middleware(mockSocket, () => {})),
      on: jest.fn((event, connectionCallback) => {
        if (event === 'connection') connectionCallback(mockSocket);
      }),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn()
    };

   
    initSocket({}, mockIo);
  });

  it('should authenticate and join individual client room on connection', () => {
    expect(mockSocket.join).toHaveBeenCalledWith('user123');
  });

  it('should process join_chat and build sorted room assignments', () => {
    
    registeredEvents['join_chat']({ friendId: 'friend456' });
    
   
    expect(mockSocket.join).toHaveBeenCalledWith('friend456_user123');
  });

  it('should stream typing alerts across relevant channels', () => {
    registeredEvents['typing_start']({ receiverId: 'friend456' });

    expect(mockSocket.to).toHaveBeenCalledWith('friend456_user123');
    expect(mockSocket.emit).toHaveBeenCalledWith('user_typing', { userId: 'user123' });
  });

  it('should parse database attachments and emit send_message updates', async () => {
    const mockPopulatedMessage = {
      sender: 'user123',
      receiver: 'friend456',
      content: 'Hello World',
      populate: jest.fn().mockResolvedValue({ content: 'Hello World', sender: { username: 'tester' } })
    };
    mockCreateMessage.mockResolvedValue(mockPopulatedMessage);

    await registeredEvents['send_message']({ receiverId: 'friend456', content: 'Hello World' });

    expect(mockCreateMessage).toHaveBeenCalledWith(expect.objectContaining({
      sender: 'user123',
      content: 'Hello World',
      type: 'text'
    }));
    expect(mockIo.emit).not.toHaveBeenLastCalledWith('error');
  });
});