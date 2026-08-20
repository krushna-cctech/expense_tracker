import { Router } from 'express';
import mongoose from 'mongoose';
import {
  createExpenseSchema,
  updateExpenseSchema,
} from '@expense-tracker/shared';
import { ExpenseModel } from '../models/Expense.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../validate.js';
import { toExpenseDTO } from '../mappers.js';

export const expensesRouter = Router();

// All expense routes require authentication and are scoped to req.userId.
expensesRouter.use(requireAuth);

function assertValidId(id: string): void {
  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(404, 'Expense not found');
  }
}

expensesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const expenses = await ExpenseModel.find({ userId: req.userId }).sort({
      date: -1,
      createdAt: -1,
    });
    res.json(expenses.map(toExpenseDTO));
  }),
);

expensesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const input = validate(createExpenseSchema, req.body);
    const expense = await ExpenseModel.create({ ...input, userId: req.userId });
    res.status(201).json(toExpenseDTO(expense));
  }),
);

expensesRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    assertValidId(req.params.id);
    const input = validate(updateExpenseSchema, req.body);
    const expense = await ExpenseModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      input,
      { new: true },
    );
    if (!expense) {
      throw new HttpError(404, 'Expense not found');
    }
    res.json(toExpenseDTO(expense));
  }),
);

expensesRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    assertValidId(req.params.id);
    const result = await ExpenseModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!result) {
      throw new HttpError(404, 'Expense not found');
    }
    res.status(204).send();
  }),
);
