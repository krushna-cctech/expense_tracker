import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
} from '@expense-tracker/shared';
import * as expensesApi from '../../api/expenses';

const EXPENSES_KEY = ['expenses'] as const;

export function useExpenses() {
  return useQuery({
    queryKey: EXPENSES_KEY,
    queryFn: expensesApi.listExpenses,
  });
}

export function useCreateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateExpenseInput) => expensesApi.createExpense(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateExpenseInput }) =>
      expensesApi.updateExpense(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: EXPENSES_KEY }),
  });
}
