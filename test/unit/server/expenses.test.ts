import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import {
  startTestServer,
  stopTestServer,
  clearDatabase,
  registerAndLogin,
  type TestApi,
} from './setup.js';

let api: TestApi;
let token: string;

beforeAll(async () => {
  api = await startTestServer();
});

afterAll(async () => {
  await stopTestServer();
});

afterEach(async () => {
  await clearDatabase();
});

async function auth(): Promise<string> {
  token = await registerAndLogin(api);
  return token;
}

const sampleExpense = {
  amount: 19.99,
  currency: 'USD',
  description: 'Lunch',
  date: '2026-08-20',
};

describe('expenses require authentication', () => {
  it('rejects unauthenticated list requests', async () => {
    const res = await api.get('/api/expenses');
    expect(res.status).toBe(401);
  });
});

describe('expense CRUD', () => {
  it('creates and lists an expense scoped to the user', async () => {
    const t = await auth();

    const created = await api
      .post('/api/expenses')
      .set('Authorization', `Bearer ${t}`)
      .send(sampleExpense);
    expect(created.status).toBe(201);
    expect(created.body.id).toBeTypeOf('string');
    expect(created.body.amount).toBe(19.99);
    expect(created.body.categoryId).toBeNull();

    const list = await api
      .get('/api/expenses')
      .set('Authorization', `Bearer ${t}`);
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
  });

  it('rejects an invalid expense with 422', async () => {
    const t = await auth();
    const res = await api
      .post('/api/expenses')
      .set('Authorization', `Bearer ${t}`)
      .send({ amount: -5, currency: 'usd', date: 'nope' });
    expect(res.status).toBe(422);
  });

  it('updates an expense', async () => {
    const t = await auth();
    const created = await api
      .post('/api/expenses')
      .set('Authorization', `Bearer ${t}`)
      .send(sampleExpense);

    const updated = await api
      .put(`/api/expenses/${created.body.id}`)
      .set('Authorization', `Bearer ${t}`)
      .send({ amount: 25 });
    expect(updated.status).toBe(200);
    expect(updated.body.amount).toBe(25);
  });

  it('deletes an expense', async () => {
    const t = await auth();
    const created = await api
      .post('/api/expenses')
      .set('Authorization', `Bearer ${t}`)
      .send(sampleExpense);

    const del = await api
      .delete(`/api/expenses/${created.body.id}`)
      .set('Authorization', `Bearer ${t}`);
    expect(del.status).toBe(204);

    const list = await api
      .get('/api/expenses')
      .set('Authorization', `Bearer ${t}`);
    expect(list.body).toHaveLength(0);
  });

  it("does not expose another user's expenses", async () => {
    const t1 = await registerAndLogin(api, 'a@example.com');
    await api
      .post('/api/expenses')
      .set('Authorization', `Bearer ${t1}`)
      .send(sampleExpense);

    const t2 = await registerAndLogin(api, 'b@example.com');
    const list = await api
      .get('/api/expenses')
      .set('Authorization', `Bearer ${t2}`);
    expect(list.body).toHaveLength(0);
  });

  it('returns 404 for an unknown expense id', async () => {
    const t = await auth();
    const res = await api
      .put('/api/expenses/000000000000000000000000')
      .set('Authorization', `Bearer ${t}`)
      .send({ amount: 5 });
    expect(res.status).toBe(404);
  });
});
