import { Router } from 'express';
import bcrypt from 'bcryptjs';
import {
  registerSchema,
  loginSchema,
  type AuthResponse,
} from '@expense-tracker/shared';
import { UserModel } from '../models/User.js';
import { asyncHandler, HttpError } from '../middleware/error.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import { validate } from '../validate.js';
import { toUserDTO } from '../mappers.js';

const SALT_ROUNDS = 10;

export const authRouter = Router();

authRouter.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { email, password } = validate(registerSchema, req.body);

    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new HttpError(409, 'An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create({ email, passwordHash });

    const body: AuthResponse = {
      token: signToken(String(user._id)),
      user: toUserDTO(user),
    };
    res.status(201).json(body);
  }),
);

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = validate(loginSchema, req.body);

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const body: AuthResponse = {
      token: signToken(String(user._id)),
      user: toUserDTO(user),
    };
    res.json(body);
  }),
);

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    res.json(toUserDTO(user));
  }),
);
