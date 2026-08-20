import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const expenseSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    description: { type: String, default: '' },
    /** ISO date string (YYYY-MM-DD) the expense occurred. */
    date: { type: String, required: true },
  },
  { timestamps: true },
);

expenseSchema.index({ userId: 1, date: -1 });

export type ExpenseDoc = InferSchemaType<typeof expenseSchema>;

export const ExpenseModel = mongoose.model('Expense', expenseSchema);
