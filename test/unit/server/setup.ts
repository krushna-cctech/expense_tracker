/** Shared test harness for server integration tests: spins up an in-memory
 *  MongoDB, builds the Express app, and provides a supertest agent. */
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { createApp } from '../../../src/server/src/app.js';

let mongo: MongoMemoryServer | undefined;

export type TestApi = ReturnType<typeof supertest>;

export async function startTestServer(): Promise<TestApi> {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const app = createApp();
  return supertest(app);
}

export async function stopTestServer() {
  await mongoose.disconnect();
  await mongo?.stop();
}

/** Remove all documents between tests for isolation. */
export async function clearDatabase() {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
}

/** Register a user and return an auth token + the supertest agent. */
export async function registerAndLogin(
  api: TestApi,
  email = 'user@example.com',
  password = 'supersecret',
): Promise<string> {
  const res = await api.post('/api/auth/register').send({ email, password });
  return res.body.token as string;
}
