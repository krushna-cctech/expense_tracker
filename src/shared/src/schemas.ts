/**
 * Zod schemas for runtime validation of API payloads.
 * Types are inferred from these schemas so validation and types never drift.
 * The server validates request bodies with these; clients reuse them for forms.
 */
import { z } from 'zod';

const CURRENCY_REGEX = /^[A-Z]{3}$/;
const HEX_COLOR_REGEX = /^#([0-9a-fA-F]{6})$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/* -------------------------------------------------------------------------- */
/* Auth                                                                       */
/* -------------------------------------------------------------------------- */

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof loginSchema>;

/* -------------------------------------------------------------------------- */
/* Expenses                                                                   */
/* -------------------------------------------------------------------------- */

export const createExpenseSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  currency: z
    .string()
    .regex(CURRENCY_REGEX, 'Currency must be a 3-letter ISO code'),
  categoryId: z.string().nullable().optional().default(null),
  description: z.string().max(280).default(''),
  date: z.string().regex(ISO_DATE_REGEX, 'Date must be YYYY-MM-DD'),
});
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

/** All fields optional for partial updates; at least one must be present. */
export const updateExpenseSchema = createExpenseSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export const createCategorySchema = z.object({
  name: z.string().min(1).max(60),
  color: z.string().regex(HEX_COLOR_REGEX, 'Color must be a #RRGGBB hex value'),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
