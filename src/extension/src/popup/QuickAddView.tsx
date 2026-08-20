import { useState, type FormEvent } from 'react';
import { createExpenseSchema } from '@expense-tracker/shared';
import { createExpense } from '../api';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function QuickAddView({ onLogout }: { onLogout: () => void }) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const parsed = createExpenseSchema.safeParse({
      amount: Number(amount),
      currency,
      description,
      date: today(),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    setSubmitting(true);
    try {
      await createExpense(parsed.data);
      setAmount('');
      setDescription('');
      setSaved(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="popup-header">
        <h1>Add expense</h1>
        <button type="button" className="link" onClick={onLogout}>
          Sign out
        </button>
      </div>
      <div className="row">
        <label>
          Amount
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Currency
          <input
            type="text"
            maxLength={3}
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
          />
        </label>
      </div>
      <label>
        Description
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was it for?"
        />
      </label>
      {error && <p className="error">{error}</p>}
      {saved && <p className="success">Saved!</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save expense'}
      </button>
    </form>
  );
}
