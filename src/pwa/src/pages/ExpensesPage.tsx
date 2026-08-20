import { useAuth } from '../auth/useAuth';
import { ExpenseForm } from '../features/expenses/ExpenseForm';
import { ExpenseList } from '../features/expenses/ExpenseList';
import { CategoryManager } from '../features/categories/CategoryManager';
import { Summary } from '../features/reports/Summary';
import { OfflineBanner } from '../offline/OfflineBanner';

export function ExpensesPage() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <OfflineBanner />
      <header className="app-header">
        <h1>Expense Tracker</h1>
        <div className="app-header-right">
          <span className="muted">{user?.email}</span>
          <button type="button" className="link" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>
      <main className="app-main">
        <ExpenseForm />
        <Summary />
        <section className="card">
          <h2>Expenses</h2>
          <ExpenseList />
        </section>
        <CategoryManager />
      </main>
    </div>
  );
}
