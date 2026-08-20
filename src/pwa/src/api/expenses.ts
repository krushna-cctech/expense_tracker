import type {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
} from '@expense-tracker/shared';
import { API_ROUTES } from '@expense-tracker/shared';
import { apiFetch } from './http';

export function listExpenses(): Promise<Expense[]> {
  return apiFetch<Expense[]>(API_ROUTES.expenses.list);
}

export function createExpense(input: CreateExpenseInput): Promise<Expense> {
  return apiFetch<Expense>(API_ROUTES.expenses.create, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateExpense(
  id: string,
  input: UpdateExpenseInput,
): Promise<Expense> {
  return apiFetch<Expense>(API_ROUTES.expenses.byId(id), {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function deleteExpense(id: string): Promise<void> {
  return apiFetch<void>(API_ROUTES.expenses.byId(id), { method: 'DELETE' });
}
