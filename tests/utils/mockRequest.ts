export function createMockRequest(
  url: string,
  method: string,
  body?: any,
  token?: string
): Request {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('cookie', `token=${token}`);
  }

  return new Request(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}
