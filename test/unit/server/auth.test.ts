import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import {
  startTestServer,
  stopTestServer,
  clearDatabase,
  type TestApi,
} from './setup.js';

let api: TestApi;

beforeAll(async () => {
  api = await startTestServer();
});

afterAll(async () => {
  await stopTestServer();
});

afterEach(async () => {
  await clearDatabase();
});

describe('POST /api/auth/register', () => {
  it('creates a user and returns a token', async () => {
    const res = await api
      .post('/api/auth/register')
      .send({ email: 'new@example.com', password: 'supersecret' });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeTypeOf('string');
    expect(res.body.user.email).toBe('new@example.com');
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('rejects a duplicate email', async () => {
    await api
      .post('/api/auth/register')
      .send({ email: 'dupe@example.com', password: 'supersecret' });
    const res = await api
      .post('/api/auth/register')
      .send({ email: 'dupe@example.com', password: 'supersecret' });

    expect(res.status).toBe(409);
  });

  it('rejects an invalid payload with 422 and field details', async () => {
    const res = await api
      .post('/api/auth/register')
      .send({ email: 'bad', password: 'short' });

    expect(res.status).toBe(422);
    expect(res.body.details).toHaveProperty('email');
    expect(res.body.details).toHaveProperty('password');
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    await api
      .post('/api/auth/register')
      .send({ email: 'login@example.com', password: 'supersecret' });
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'supersecret' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTypeOf('string');
  });

  it('rejects wrong password with 401', async () => {
    await api
      .post('/api/auth/register')
      .send({ email: 'login2@example.com', password: 'supersecret' });
    const res = await api
      .post('/api/auth/login')
      .send({ email: 'login2@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the current user with a valid token', async () => {
    const reg = await api
      .post('/api/auth/register')
      .send({ email: 'me@example.com', password: 'supersecret' });
    const res = await api
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${reg.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('me@example.com');
  });

  it('rejects requests without a token', async () => {
    const res = await api.get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
