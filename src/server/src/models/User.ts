import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema>;

export const UserModel = mongoose.model('User', userSchema);
