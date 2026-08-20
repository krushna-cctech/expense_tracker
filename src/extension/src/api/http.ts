/** Typed fetch wrapper for the extension. Mirrors the PWA's http.ts but reads
 *  the token asynchronously from browser.storage. */
import type { ApiError } from '@expense-tracker/shared';
import { getToken } from '../storage';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export class ApiRequestError extends Error {
  status: number;
  details?: Record<string, string[]>;

  constructor(status: number, body: ApiError) {
    super(body.error);
    this.status = status;
    this.details = body.details;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json().catch(() => ({ error: res.statusText }));

  if (!res.ok) {
    throw new ApiRequestError(res.status, data as ApiError);
  }

  return data as T;
}
