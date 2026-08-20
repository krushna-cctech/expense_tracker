import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@expense-tracker/shared';
import { API_ROUTES } from '@expense-tracker/shared';
import { apiFetch } from './http';

export function listCategories(): Promise<Category[]> {
  return apiFetch<Category[]>(API_ROUTES.categories.list);
}

export function createCategory(input: CreateCategoryInput): Promise<Category> {
  return apiFetch<Category>(API_ROUTES.categories.create, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateCategory(
  id: string,
  input: UpdateCategoryInput,
): Promise<Category> {
  return apiFetch<Category>(API_ROUTES.categories.byId(id), {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function deleteCategory(id: string): Promise<void> {
  return apiFetch<void>(API_ROUTES.categories.byId(id), { method: 'DELETE' });
}
