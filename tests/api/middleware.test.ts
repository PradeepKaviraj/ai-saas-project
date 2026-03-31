import { middleware } from '../../middleware';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn(),
    next: jest.fn(),
  },
}));

describe('Middleware', () => {
  const mockUrl = 'http://localhost/dashboard';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to /login if no token is present', () => {
    const req = {
      url: mockUrl,
      cookies: {
        get: jest.fn().mockReturnValue(undefined), // No token
      },
    } as unknown as NextRequest;

    middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL));
    expect((NextResponse.redirect as jest.Mock).mock.calls[0][0].pathname).toBe('/login');
    expect(NextResponse.next).not.toHaveBeenCalled();
  });

  it('should call NextResponse.next() if a token is present (verification is skipped)', () => {
    const req = {
      url: mockUrl,
      cookies: {
        get: jest.fn().mockReturnValue({ value: 'some-token' }),
      },
    } as unknown as NextRequest;

    middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(NextResponse.redirect).not.toHaveBeenCalled();
  });
});
