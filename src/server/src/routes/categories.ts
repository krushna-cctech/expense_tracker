import { Router } from 'express';
import mongoose from 'mongoose';
import {
  createCategorySchema,
  updateCategorySchema,
} from '@expense-tracker/shared';
import { CategoryModel } from '../models/Category.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../validate.js';
import { toCategoryDTO } from '../mappers.js';

export const categoriesRouter = Router();

categoriesRouter.use(requireAuth);

function assertValidId(id: string): void {
  if (!mongoose.isValidObjectId(id)) {
    throw new HttpError(404, 'Category not found');
  }
}

categoriesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await CategoryModel.find({ userId: req.userId }).sort({
      name: 1,
    });
    res.json(categories.map(toCategoryDTO));
  }),
);

categoriesRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const input = validate(createCategorySchema, req.body);
    const category = await CategoryModel.create({
      ...input,
      userId: req.userId,
    });
    res.status(201).json(toCategoryDTO(category));
  }),
);

categoriesRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    assertValidId(req.params.id);
    const input = validate(updateCategorySchema, req.body);
    const category = await CategoryModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      input,
      { new: true },
    );
    if (!category) {
      throw new HttpError(404, 'Category not found');
    }
    res.json(toCategoryDTO(category));
  }),
);

categoriesRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    assertValidId(req.params.id);
    const result = await CategoryModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!result) {
      throw new HttpError(404, 'Category not found');
    }
    res.status(204).send();
  }),
);
