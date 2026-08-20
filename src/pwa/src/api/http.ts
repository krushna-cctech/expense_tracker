/** Low-level HTTP helper: token storage + a typed fetch wrapper.
 *  This is the reusable API-access pattern; the extension mirrors it with its
 *  own token storage (browser.storage instead of localStorage). */
import type { ApiError } from '@expense-tracker/shared';

const TOKEN_KEY = 'expense-tracker.token';

// When VITE_API_URL is unset, requests are relative and go through the dev
// proxy (see vite.config.ts). In production, set VITE_API_URL to the API host.
const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

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
  const token = getToken();
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
