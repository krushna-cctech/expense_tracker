import { useState, type FormEvent } from 'react';
import { createExpenseSchema } from '@expense-tracker/shared';
import { useCategories } from '../categories/useCategories';
import { useCreateExpense } from './useExpenses';

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseForm() {
  const createExpense = useCreateExpense();
  const { data: categories } = useCategories();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today());
  const [categoryId, setCategoryId] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = createExpenseSchema.safeParse({
      amount: Number(amount),
      currency,
      description,
      date,
      categoryId: categoryId || null,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    createExpense.mutate(parsed.data, {
      onSuccess: () => {
        setAmount('');
        setDescription('');
        setCategoryId('');
      },
      onError: (err) => setError((err as Error).message),
    });
  }

  return (
    <form className="card expense-form" onSubmit={handleSubmit}>
      <h2>Add expense</h2>
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
        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
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
      <label>
        Category
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Uncategorized</option>
          {(categories ?? []).map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={createExpense.isPending}>
        {createExpense.isPending ? 'Adding…' : 'Add expense'}
      </button>
    </form>
  );
}
