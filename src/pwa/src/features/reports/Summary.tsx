import type { Category, Expense } from '@expense-tracker/shared';
import { useCategories } from '../categories/useCategories';
import { useExpenses } from '../expenses/useExpenses';

interface Breakdown {
  label: string;
  color: string;
  total: number;
}

/** Reporting: total spend and a by-category breakdown.
 *  Amounts are summed per currency to avoid mixing currencies. */
function summarize(
  expenses: Expense[],
  categories: Category[],
): { byCurrency: Map<string, number>; breakdown: Breakdown[] } {
  const byCurrency = new Map<string, number>();
  const byCategory = new Map<string, number>();

  for (const e of expenses) {
    byCurrency.set(e.currency, (byCurrency.get(e.currency) ?? 0) + e.amount);
    const key = e.categoryId ?? '__uncategorized__';
    byCategory.set(key, (byCategory.get(key) ?? 0) + e.amount);
  }

  const catById = new Map(categories.map((c) => [c.id, c]));
  const breakdown: Breakdown[] = [...byCategory.entries()]
    .map(([key, total]) => {
      const cat = catById.get(key);
      return {
        label: cat?.name ?? 'Uncategorized',
        color: cat?.color ?? '#9ca3af',
        total,
      };
    })
    .sort((a, b) => b.total - a.total);

  return { byCurrency, breakdown };
}

export function Summary() {
  const { data: expenses } = useExpenses();
  const { data: categories } = useCategories();

  if (!expenses || expenses.length === 0) {
    return null;
  }

  const { byCurrency, breakdown } = summarize(expenses, categories ?? []);
  const grandTotal = breakdown.reduce((sum, b) => sum + b.total, 0);

  return (
    <section className="card">
      <h2>Summary</h2>
      <div className="summary-totals">
        {[...byCurrency.entries()].map(([currency, total]) => (
          <div key={currency} className="summary-tile">
            <span className="summary-amount">
              {total.toFixed(2)} {currency}
            </span>
            <span className="muted">total</span>
          </div>
        ))}
      </div>
      <ul className="breakdown">
        {breakdown.map((b) => (
          <li key={b.label} className="breakdown-row">
            <span className="breakdown-label">
              <span className="category-dot" style={{ background: b.color }} />
              {b.label}
            </span>
            <span className="breakdown-bar">
              <span
                className="breakdown-fill"
                style={{
                  width: `${grandTotal ? (b.total / grandTotal) * 100 : 0}%`,
                  background: b.color,
                }}
              />
            </span>
            <span className="breakdown-value">{b.total.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
