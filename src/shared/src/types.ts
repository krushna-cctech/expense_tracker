/**
 * Canonical data model for the Expense Tracker.
 * This is the single source of truth imported by the server and both clients.
 * Do not redefine these shapes elsewhere (see .agents/workingrules.md).
 */

/** A user account. Passwords are never included in client-facing shapes. */
export interface User {
  id: string;
  email: string;
  createdAt: string;
}

/** A spending category owned by a user. */
export interface Category {
  id: string;
  userId: string;
  name: string;
  /** Hex color, e.g. "#4f46e5". */
  color: string;
  createdAt: string;
  updatedAt: string;
}

/** A single expense record owned by a user. */
export interface Expense {
  id: string;
  userId: string;
  /** Amount in the currency's major unit (e.g. dollars), always positive. */
  amount: number;
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string;
  /** Optional category id; null when uncategorized. */
  categoryId: string | null;
  description: string;
  /** ISO date string (YYYY-MM-DD) the expense occurred. */
  date: string;
  createdAt: string;
  updatedAt: string;
}

/** Auth token returned on successful register/login. */
export interface AuthResponse {
  token: string;
  user: User;
}

/** Shape of the JWT payload issued by the server. */
export interface JwtPayload {
  userId: string;
}
