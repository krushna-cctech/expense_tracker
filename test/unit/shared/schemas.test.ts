import { describe, it, expect } from 'vitest';
import {
  createExpenseSchema,
  registerSchema,
  createCategorySchema,
} from '@expense-tracker/shared';

describe('registerSchema', () => {
  it('accepts a valid registration', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'supersecret',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a short password', () => {
    const result = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'not-an-email',
      password: 'supersecret',
    });
    expect(result.success).toBe(false);
  });
});

describe('createExpenseSchema', () => {
  it('accepts a valid expense and defaults optional fields', () => {
    const result = createExpenseSchema.safeParse({
      amount: 12.5,
      currency: 'USD',
      date: '2026-08-20',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.categoryId).toBeNull();
      expect(result.data.description).toBe('');
    }
  });

  it('rejects a non-positive amount', () => {
    const result = createExpenseSchema.safeParse({
      amount: 0,
      currency: 'USD',
      date: '2026-08-20',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed currency code', () => {
    const result = createExpenseSchema.safeParse({
      amount: 5,
      currency: 'dollars',
      date: '2026-08-20',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed date', () => {
    const result = createExpenseSchema.safeParse({
      amount: 5,
      currency: 'USD',
      date: '08/20/2026',
    });
    expect(result.success).toBe(false);
  });
});

describe('createCategorySchema', () => {
  it('accepts a valid category', () => {
    const result = createCategorySchema.safeParse({
      name: 'Groceries',
      color: '#4f46e5',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid hex color', () => {
    const result = createCategorySchema.safeParse({
      name: 'Groceries',
      color: 'blue',
    });
    expect(result.success).toBe(false);
  });
});
