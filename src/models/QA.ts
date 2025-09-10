import mongoose, { Schema } from 'mongoose';
import type { IQA } from '../interfaces/index.js';

const QASchema: Schema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    answer: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    answererId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for course details
QASchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for user (questioner) details
QASchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for answerer details
QASchema.virtual('answerer', {
  ref: 'User',
  localField: 'answererId',
  foreignField: '_id',
  justOne: true,
});

// Indexes for better performance
QASchema.index({ courseId: 1, createdAt: -1 });
QASchema.index({ userId: 1 });
QASchema.index({ answererId: 1 });

export default mongoose.model<IQA>('QA', QASchema);
