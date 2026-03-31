import { generateAIResponse } from '@/services/aiService';

describe('AI Service', () => {
  const mockMessages = [{ role: 'user', content: 'hello' }];
  const mockMode = 'casual';

  describe('generateAIResponse', () => {
    it('should return successful response string', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: 'Mock generated response' }),
      });

      const response = await generateAIResponse(mockMessages as any, mockMode as any);
      expect(response).toBe('Mock generated response');
      expect(global.fetch).toHaveBeenCalledWith('/api/ai/generate', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: mockMessages, mode: mockMode }),
      }));
    });

    it('should throw an error when res.ok is false API failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(generateAIResponse(mockMessages as any, mockMode as any)).rejects.toThrow('AI request failed');
    });

    it('should throw an error for invalid JSON response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new SyntaxError('Unexpected token'); },
      });

      await expect(generateAIResponse(mockMessages as any, mockMode as any)).rejects.toThrow(SyntaxError);
    });

    it('should throw an error on network failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

      await expect(generateAIResponse(mockMessages as any, mockMode as any)).rejects.toThrow('Network Error');
    });
  });
});
