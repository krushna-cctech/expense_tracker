import { useState, type FormEvent } from 'react';
import { createCategorySchema } from '@expense-tracker/shared';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from './useCategories';

const DEFAULT_COLOR = '#4f46e5';

export function CategoryManager() {
  const { data: categories } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = createCategorySchema.safeParse({ name, color });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }
    createCategory.mutate(parsed.data, {
      onSuccess: () => setName(''),
      onError: (err) => setError((err as Error).message),
    });
  }

  return (
    <section className="card">
      <h2>Categories</h2>
      <form className="row" onSubmit={handleSubmit}>
        <label style={{ flex: 2 }}>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Groceries"
          />
        </label>
        <label>
          Color
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <button type="submit" disabled={createCategory.isPending}>
          Add
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul className="category-list">
        {(categories ?? []).map((cat) => (
          <li key={cat.id} className="category-item">
            <span className="category-chip">
              <span
                className="category-dot"
                style={{ background: cat.color }}
              />
              {cat.name}
            </span>
            <button
              type="button"
              className="link-danger"
              onClick={() => deleteCategory.mutate(cat.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
