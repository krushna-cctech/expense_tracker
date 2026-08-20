/** Map Mongoose documents to the shared DTO shapes returned by the API.
 *  Parameters are typed as `unknown` and narrowed internally: Mongoose's
 *  inferred document types don't expose _id/timestamps in a convenient form,
 *  so we read the fields we need defensively without leaking `any`. */
import type { User, Expense, Category } from '@expense-tracker/shared';

interface RawUser {
  _id: unknown;
  email: string;
  createdAt?: Date;
}

interface RawCategory {
  _id: unknown;
  userId: unknown;
  name: string;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RawExpense {
  _id: unknown;
  userId: unknown;
  amount: number;
  currency: string;
  categoryId: unknown;
  description: string;
  date: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const id = (value: unknown): string => String(value);
const iso = (value?: Date): string => (value ?? new Date(0)).toISOString();

export function toUserDTO(doc: unknown): User {
  const d = doc as RawUser;
  return {
    id: id(d._id),
    email: d.email,
    createdAt: iso(d.createdAt),
  };
}

export function toCategoryDTO(doc: unknown): Category {
  const d = doc as RawCategory;
  return {
    id: id(d._id),
    userId: id(d.userId),
    name: d.name,
    color: d.color,
    createdAt: iso(d.createdAt),
    updatedAt: iso(d.updatedAt),
  };
}

export function toExpenseDTO(doc: unknown): Expense {
  const d = doc as RawExpense;
  return {
    id: id(d._id),
    userId: id(d.userId),
    amount: d.amount,
    currency: d.currency,
    categoryId: d.categoryId ? id(d.categoryId) : null,
    description: d.description,
    date: d.date,
    createdAt: iso(d.createdAt),
    updatedAt: iso(d.updatedAt),
  };
}
