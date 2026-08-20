import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const categorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    color: { type: String, required: true },
  },
  { timestamps: true },
);

categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export type CategoryDoc = InferSchemaType<typeof categorySchema>;

export const CategoryModel = mongoose.model('Category', categorySchema);
