import mongoose, { Schema } from 'mongoose';
import type { IReview } from '../interfaces/index.js';

const ReviewSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for user details
ReviewSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for course details
ReviewSchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true,
});

// Compound index to ensure unique review per user per course
ReviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });
ReviewSchema.index({ courseId: 1, rating: -1 });
ReviewSchema.index({ userId: 1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
