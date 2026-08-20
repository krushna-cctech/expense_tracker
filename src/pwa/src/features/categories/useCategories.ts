import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { CreateCategoryInput } from '@expense-tracker/shared';
import * as categoriesApi from '../../api/categories';

const CATEGORIES_KEY = ['categories'] as const;

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: categoriesApi.listCategories,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      categoriesApi.createCategory(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}
