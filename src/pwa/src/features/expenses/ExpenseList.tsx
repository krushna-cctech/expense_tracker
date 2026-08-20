import type { Expense } from '@expense-tracker/shared';
import { useCategories } from '../categories/useCategories';
import { useDeleteExpense, useExpenses } from './useExpenses';

function formatAmount(expense: Expense): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: expense.currency,
    }).format(expense.amount);
  } catch {
    return `${expense.amount} ${expense.currency}`;
  }
}

export function ExpenseList() {
  const { data: expenses, isLoading, isError, error } = useExpenses();
  const { data: categories } = useCategories();
  const deleteExpense = useDeleteExpense();

  const categoryById = new Map((categories ?? []).map((c) => [c.id, c]));

  if (isLoading) {
    return <p>Loading expenses…</p>;
  }
  if (isError) {
    return <p className="error">{(error as Error).message}</p>;
  }
  if (!expenses || expenses.length === 0) {
    return <p className="muted">No expenses yet. Add your first one above.</p>;
  }

  return (
    <ul className="expense-list">
      {expenses.map((expense) => (
        <li key={expense.id} className="expense-item">
          <div>
            <span className="expense-desc">
              {expense.description || 'Untitled'}
            </span>
            <span className="expense-date">
              {expense.date}
              {expense.categoryId && categoryById.has(expense.categoryId) && (
                <span className="category-chip inline">
                  <span
                    className="category-dot"
                    style={{
                      background: categoryById.get(expense.categoryId)!.color,
                    }}
                  />
                  {categoryById.get(expense.categoryId)!.name}
                </span>
              )}
            </span>
          </div>
          <div className="expense-actions">
            <span className="expense-amount">{formatAmount(expense)}</span>
            <button
              type="button"
              className="link-danger"
              onClick={() => deleteExpense.mutate(expense.id)}
              disabled={deleteExpense.isPending}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
