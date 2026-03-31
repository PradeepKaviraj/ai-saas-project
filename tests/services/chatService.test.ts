import { saveChat, getAllChats, deleteChat } from '@/services/chatService';

describe('Chat Service', () => {
  describe('saveChat', () => {
    it('should successfully save a chat', async () => {
      const mockMessages = [{ role: 'user', content: 'test' }];
      const expectedResponse = { id: 'chat1', messages: mockMessages };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => expectedResponse,
      });

      const res = await saveChat(mockMessages as any, 'chat1');
      expect(res).toEqual(expectedResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/chat', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ messages: mockMessages, chatId: 'chat1' }),
      }));
    });

    it('should throw an error on failure to save chat', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(saveChat([], 'chat1')).rejects.toThrow('Failed to save chat');
    });
  });

  describe('getAllChats', () => {
    it('should successfully retrieve all chats', async () => {
      const expectedResponse = [{ id: 'chat1' }, { id: 'chat2' }];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => expectedResponse,
      });

      const res = await getAllChats();
      expect(res).toEqual(expectedResponse);
    });

    it('should return empty array if response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const res = await getAllChats();
      expect(res).toEqual([]);
    });

    it('should return empty array if data is not an array', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ not: 'an array' }),
      });

      const res = await getAllChats();
      expect(res).toEqual([]);
    });
  });

  describe('deleteChat', () => {
    it('should successfully return true on deleted chat', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const res = await deleteChat('chat1');
      expect(res).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('/api/chat/delete', expect.objectContaining({
        method: 'DELETE',
        body: JSON.stringify({ chatId: 'chat1' }),
      }));
    });

    it('should return false on delete failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      const res = await deleteChat('chat1');
      expect(res).toBe(false);
    });
  });

  describe('Concurrency & Stability Tests', () => {
    it('should handle multiple rapid concurrent saves without crashing and return proper objects', async () => {
      const mockMessages = [{ role: 'user', content: 'test load' }];
      
      // Setup mock to resolve successfully multiple times
      (global.fetch as jest.Mock).mockImplementation(() => Promise.resolve({
        ok: true,
        json: async () => ({ id: 'chat-speed', messages: mockMessages })
      }));

      const concurrentCalls = Array(10).fill(null).map((_, i) => saveChat(mockMessages as any, `chat-${i}`));
      const results = await Promise.all(concurrentCalls);

      expect(results).toHaveLength(10);
      results.forEach(res => {
        expect(res).toHaveProperty('id', 'chat-speed');
        expect(res).toHaveProperty('messages');
      });
      expect(global.fetch).toHaveBeenCalledTimes(10);
    });
  });
});
