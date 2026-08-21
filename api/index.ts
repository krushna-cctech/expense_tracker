import type { Request, Response } from 'express';
import { createApp } from '../src/server/src/app.js';
import { connectDb } from '../src/server/src/db.js';
import { config } from '../src/server/src/config.js';

const app = createApp();
let connection: Promise<void> | undefined;

function connectOnce(): Promise<void> {
  connection ??= connectDb(config.mongoUri).catch((error) => {
    connection = undefined;
    throw error;
  });
  return connection;
}

export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  await connectOnce();
  app(req, res);
}