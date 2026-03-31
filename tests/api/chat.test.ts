import { POST as chatPOST } from '@/app/api/chat/route';
import { GET as chatAllGET } from '@/app/api/chat/all/route';
import { DELETE as chatDeleteDELETE } from '@/app/api/chat/delete/route';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { createMockRequest } from '../utils/mockRequest';

describe('Chat API Routes', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('POST /api/chat', () => {
    it('should successfully create a new chat', async () => {
      const expectedChat = { id: 'chat1', userId: 'test-user-id', messages: [{ role: 'user', content: 'hi' }] };
      (prisma.chat.create as jest.Mock).mockResolvedValueOnce(expectedChat);

      const req = createMockRequest('http://localhost/api/chat', 'POST', {
        messages: [{ role: 'user', content: 'hi' }]
      }, 'mock-token');

      const res = await chatPOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(expectedChat); // Strict structure mapping
      expect(prisma.chat.create).toHaveBeenCalled();
    });

    it('should successfully update an existing chat', async () => {
      const expectedChat = { id: 'chat1', userId: 'test-user-id', messages: [{ role: 'user', content: 'hi' }] };
      (prisma.chat.update as jest.Mock).mockResolvedValueOnce(expectedChat);

      const req = createMockRequest('http://localhost/api/chat', 'POST', {
        messages: [{ role: 'user', content: 'hi' }],
        chatId: 'chat1'
      }, 'mock-token');

      const res = await chatPOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(expectedChat);
      expect(prisma.chat.update).toHaveBeenCalled();
    });

    it('should return 401 missing token', async () => {
      const req = createMockRequest('http://localhost/api/chat', 'POST', {
        messages: [{ role: 'user', content: 'hi' }]
      }); // omitted token

      const res = await chatPOST(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
    });

    it('should throw and return 500 on invalid token processing or prisma error', async () => {
      const req = createMockRequest('http://localhost/api/chat', 'POST', {
        messages: [{ role: 'user', content: 'hi' }]
      }, 'mock-token');

      (jwt.verify as jest.Mock).mockImplementationOnce(() => { throw new Error('Invalid JWT'); });

      const res = await chatPOST(req);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data).toEqual({ message: 'Failed' });
    });
  });

  describe('GET /api/chat/all', () => {
    it('should successfully retrieve all chats for user', async () => {
      const expectedChats = [{ id: 'chat1' }, { id: 'chat2' }];
      (prisma.chat.findMany as jest.Mock).mockResolvedValueOnce(expectedChats);

      const req = createMockRequest('http://localhost/api/chat/all', 'GET', undefined, 'mock-token');

      const res = await chatAllGET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(expectedChats);
    });

    it('should return empty array if no chats found', async () => {
      (prisma.chat.findMany as jest.Mock).mockResolvedValueOnce([]);

      const req = createMockRequest('http://localhost/api/chat/all', 'GET', undefined, 'mock-token');

      const res = await chatAllGET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should return empty array when missing token', async () => {
      const req = createMockRequest('http://localhost/api/chat/all', 'GET');

      const res = await chatAllGET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should return empty array on invalid token parsing', async () => {
      const req = createMockRequest('http://localhost/api/chat/all', 'GET', undefined, 'invalid-token');
      (jwt.verify as jest.Mock).mockImplementationOnce(() => { throw new Error('Invalid JWT'); });

      const res = await chatAllGET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual([]);
    });
  });

  describe('DELETE /api/chat/delete', () => {
    it('should delete existing chat successfully', async () => {
      (prisma.chat.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'chat1',
        userId: 'test-user-id'
      });
      (prisma.chat.delete as jest.Mock).mockResolvedValueOnce({});

      const req = createMockRequest('http://localhost/api/chat/delete', 'DELETE', {
        chatId: 'chat1'
      }, 'mock-token');

      const res = await chatDeleteDELETE(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ message: 'Deleted' });
    });

    it('should return 401 when missing token', async () => {
      const req = createMockRequest('http://localhost/api/chat/delete', 'DELETE', {
        chatId: 'chat1'
      });

      const res = await chatDeleteDELETE(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data).toEqual({ message: 'Unauthorized' });
    });

    it('should return 404 if chat belongs to someone else (userId mismatch)', async () => {
      (prisma.chat.findUnique as jest.Mock).mockResolvedValueOnce({
        id: 'chat1',
        userId: 'some-other-id'
      });

      const req = createMockRequest('http://localhost/api/chat/delete', 'DELETE', {
        chatId: 'chat1'
      }, 'mock-token');

      const res = await chatDeleteDELETE(req);
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data).toEqual({ message: 'Not found' });
    });

    it('should return 404 if chat is not found', async () => {
      (prisma.chat.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const req = createMockRequest('http://localhost/api/chat/delete', 'DELETE', {
        chatId: 'chat1'
      }, 'mock-token');

      const res = await chatDeleteDELETE(req);
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data).toEqual({ message: 'Not found' });
    });

    it('should return 500 on internal failure', async () => {
      (prisma.chat.findUnique as jest.Mock).mockRejectedValueOnce(new Error('DB Query Failed'));

      const req = createMockRequest('http://localhost/api/chat/delete', 'DELETE', {
        chatId: 'chat1'
      }, 'mock-token');

      const res = await chatDeleteDELETE(req);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data).toEqual({ message: 'Failed' });
    });
  });

});
