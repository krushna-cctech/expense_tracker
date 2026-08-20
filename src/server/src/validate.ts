/** Validate a request payload against a Zod schema, throwing HttpError(422). */
import type { ZodSchema } from 'zod';
import { HttpError } from './middleware/error.js';

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.') || '_';
      (details[key] ??= []).push(issue.message);
    }
    throw new HttpError(422, 'Validation failed', details);
  }
  return result.data;
}
