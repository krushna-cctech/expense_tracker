import type {
  AuthResponse,
  CreateExpenseInput,
  Expense,
  LoginInput,
} from '@expense-tracker/shared';
import { API_ROUTES } from '@expense-tracker/shared';
import { apiFetch } from './http';

export function login(input: LoginInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(API_ROUTES.auth.login, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function createExpense(input: CreateExpenseInput): Promise<Expense> {
  return apiFetch<Expense>(API_ROUTES.expenses.create, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
