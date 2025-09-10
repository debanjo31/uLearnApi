import mongoose, { Schema } from 'mongoose';
import type { IEnrollment } from '../interfaces/index.js';

const EnrollmentSchema: Schema = new Schema(
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
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 100,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'free'],
      default: 'pending',
    },
    certificateUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for user details
EnrollmentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for course details
EnrollmentSchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true,
});

// Compound index to ensure unique enrollment per user per course
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
EnrollmentSchema.index({ userId: 1 });
EnrollmentSchema.index({ courseId: 1 });
EnrollmentSchema.index({ paymentStatus: 1 });

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);
