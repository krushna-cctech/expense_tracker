/** Express app factory. Kept separate from index.ts so tests can import the
 *  app without opening a network socket or connecting to a database. */
import express, { type Express } from 'express';
import cors from 'cors';
import { API_ROUTES } from '@expense-tracker/shared';
import { config } from './config.js';
import { authRouter } from './routes/auth.js';
import { expensesRouter } from './routes/expenses.js';
import { categoriesRouter } from './routes/categories.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/expenses', expensesRouter);
  app.use('/api/categories', categoriesRouter);

  // Silence unused-import lint if routes are ever refactored to use the map.
  void API_ROUTES;

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
