import { POST as aiGeneratePOST } from '@/app/api/ai/generate/route';
import { createMockRequest } from '../utils/mockRequest';
// The openai module is mocked globally in setup.ts

describe('AI API Routes', () => {
  describe('POST /api/ai/generate', () => {
    
    it('should generate an AI response successfully', async () => {
      const req = createMockRequest('http://localhost/api/ai/generate', 'POST', {
        messages: [{ role: 'user', content: 'hello' }],
        mode: 'general',
      });

      const res = await aiGeneratePOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.result).toBe('mocked AI response');
    });

    it('should use default general mode fallback for invalid mode', async () => {
      const req = createMockRequest('http://localhost/api/ai/generate', 'POST', {
        messages: [{ role: 'user', content: 'hello' }],
        mode: 'random-invalid-mode',
      });

      const res = await aiGeneratePOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.result).toBe('mocked AI response'); // OpenRouter handles it correctly since mode falls back to general prompt
    });

    it('should return 400 if messages are missing', async () => {
      const req = createMockRequest('http://localhost/api/ai/generate', 'POST', {
        mode: 'general', // missing messages
      });

      const res = await aiGeneratePOST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.message).toBe('Messages required');
    });

    it('should handle internal errors gracefully (mocked failure)', async () => {
      const req = createMockRequest('http://localhost/api/ai/generate', 'POST', {
        messages: [{ role: 'user', content: 'hello' }],
      });
      // Override json() to throw an error, hitting the catch block
      req.json = async () => { throw new Error('Internal mock error'); };

      const res = await aiGeneratePOST(req);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data).toEqual({ message: 'AI failed' });
    });

    describe('Concurrency & Stability Tests', () => {
      it('should handle rapid concurrent generation calls correctly', async () => {
        const reqs = Array(5).fill(null).map(() => createMockRequest('http://localhost/api/ai/generate', 'POST', {
          messages: [{ role: 'user', content: 'hello' }],
          mode: 'general',
        }));

        const results = await Promise.all(reqs.map(r => aiGeneratePOST(r)));
        
        expect(results).toHaveLength(5);
        for (const r of results) {
          expect(r.status).toBe(200);
          const data = await r.json();
          expect(data).toEqual({ result: 'mocked AI response' }); // Strict structure matching
        }
      });
    });

  });
});
