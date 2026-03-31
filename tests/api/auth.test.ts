import { POST as signupPOST } from '@/app/api/auth/signup/route';
import { POST as loginPOST } from '@/app/api/auth/login/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { createMockRequest } from '../utils/mockRequest';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

describe('Auth API Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a user successfully', async () => {
      (prisma.user.create as jest.Mock).mockResolvedValueOnce({ id: '1', email: 'test@test.com' });

      const req = createMockRequest('http://localhost/api/auth/signup', 'POST', {
        email: 'test@test.com',
        password: 'password123',
      });

      const res = await signupPOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ message: 'User created successfully' });
    });

    it('should return 400 for missing fields (validation failure)', async () => {
      const req = createMockRequest('http://localhost/api/auth/signup', 'POST', {
        email: 'test@test.com',
      });

      const res = await signupPOST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data).toEqual({ message: 'Missing fields' });
    });

    it('should return 400 for duplicate user (P2002 error)', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValueOnce({ code: 'P2002' });

      const req = createMockRequest('http://localhost/api/auth/signup', 'POST', {
        email: 'test@test.com',
        password: 'password123',
      });

      const res = await signupPOST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data).toEqual({ message: 'User already exists' });
    });

    it('should return 500 on unexpected internal signup error', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValueOnce(new Error('Unexpected Data Error'));

      const req = createMockRequest('http://localhost/api/auth/signup', 'POST', {
        email: 'test@test.com',
        password: 'password123',
      });

      const res = await signupPOST(req);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data).toEqual({ message: 'Internal server error' });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and set cookie', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '1',
        email: 'test@test.com',
        password: 'hashed-password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const req = createMockRequest('http://localhost/api/auth/login', 'POST', {
        email: 'test@test.com',
        password: 'password123',
      });

      const res = await loginPOST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual({ message: 'Login successful' });
      expect(res.headers.get('set-cookie')).toContain('token=mock-token');
    });

    it('should return 404 for user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const req = createMockRequest('http://localhost/api/auth/login', 'POST', {
        email: 'nonexistent@test.com',
        password: 'password123',
      });

      const res = await loginPOST(req);
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data).toEqual({ message: 'User not found' });
    });

    it('should return 401 for wrong password', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
        id: '1',
        email: 'test@test.com',
        password: 'hashed-password',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const req = createMockRequest('http://localhost/api/auth/login', 'POST', {
        email: 'test@test.com',
        password: 'wrongpassword',
      });

      const res = await loginPOST(req);
      const data = await res.json();

      expect(res.status).toBe(401);
      expect(data).toEqual({ message: 'Invalid credentials' });
    });

    it('should return 400 for missing login fields', async () => {
      const req = createMockRequest('http://localhost/api/auth/login', 'POST', {
        password: 'password123', // missing email
      });

      const res = await loginPOST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data).toEqual({ message: 'Missing fields' });
    });

    it('should return 500 on unexpected internal login error', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValueOnce(new Error('DB downtime'));

      const req = createMockRequest('http://localhost/api/auth/login', 'POST', {
        email: 'test@test.com',
        password: 'password123',
      });

      const res = await loginPOST(req);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data).toEqual({ message: 'Internal server error' });
    });
  });
});
