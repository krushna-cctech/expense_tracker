/**
 * API contract shared by the server and clients.
 * Keep route paths in one place so clients and the server never disagree.
 */

export const API_BASE = '/api';

export const API_ROUTES = {
  auth: {
    register: `${API_BASE}/auth/register`,
    login: `${API_BASE}/auth/login`,
    me: `${API_BASE}/auth/me`,
  },
  expenses: {
    list: `${API_BASE}/expenses`,
    create: `${API_BASE}/expenses`,
    byId: (id: string) => `${API_BASE}/expenses/${id}`,
  },
  categories: {
    list: `${API_BASE}/categories`,
    create: `${API_BASE}/categories`,
    byId: (id: string) => `${API_BASE}/categories/${id}`,
  },
} as const;

/** Standard error body returned by the API. */
export interface ApiError {
  error: string;
  /** Field-level validation issues, keyed by field path. */
  details?: Record<string, string[]>;
}
