/** Centralized error handling and a typed HTTP error. */
import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { ApiError } from '@expense-tracker/shared';

export class HttpError extends Error {
  status: number;
  details?: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** Wrap an async handler so rejected promises reach the error middleware. */
export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export const notFoundHandler: RequestHandler = (_req, res) => {
  const body: ApiError = { error: 'Not found' };
  res.status(404).json(body);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    const body: ApiError = { error: err.message, details: err.details };
    res.status(err.status).json(body);
    return;
  }

  // Duplicate key (e.g. email or category name already exists).
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = (err as { code?: number }).code;
    if (code === 11000) {
      const body: ApiError = { error: 'Resource already exists' };
      res.status(409).json(body);
      return;
    }
  }

  console.error('Unhandled error:', err);
  const body: ApiError = { error: 'Internal server error' };
  res.status(500).json(body);
};
