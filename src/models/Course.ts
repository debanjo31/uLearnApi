import mongoose, { Schema } from 'mongoose';
import type { ICourse } from '../interfaces/index.js';

const CourseSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    price: {
      type: Number,
      default: 0.0,
      min: 0,
    },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'unpublished'],
      default: 'draft',
    },
    duration: {
      type: Number,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 5,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for instructor details
CourseSchema.virtual('instructor', {
  ref: 'User',
  localField: 'instructorId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for sections
CourseSchema.virtual('sections', {
  ref: 'Section',
  localField: '_id',
  foreignField: 'courseId',
});

// Virtual for enrollments
CourseSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'courseId',
});

// Virtual for reviews
CourseSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'courseId',
});

// Virtual for questions
CourseSchema.virtual('questions', {
  ref: 'QA',
  localField: '_id',
  foreignField: 'courseId',
});

// Virtual for payments
CourseSchema.virtual('payments', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'courseId',
});

// Indexes for better performance
CourseSchema.index({ title: 'text', description: 'text' });
CourseSchema.index({ category: 1, level: 1 });
CourseSchema.index({ price: 1 });
CourseSchema.index({ rating: -1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ instructorId: 1 });

export default mongoose.model<ICourse>('Course', CourseSchema);
