import mongoose, { Schema } from 'mongoose';
import type { IUser } from '../interfaces/index.js';

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Exclude password from query results by default
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    bio: {
      type: String,
      trim: true,
    },
    profilePicture: {
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

// Virtual for courses created by instructor
UserSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'instructorId',
});

// Virtual for enrollments
UserSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'userId',
});

// Virtual for reviews
UserSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'userId',
});

// Virtual for questions asked
UserSchema.virtual('questions', {
  ref: 'QA',
  localField: '_id',
  foreignField: 'userId',
});

// Virtual for answers given
UserSchema.virtual('answers', {
  ref: 'QA',
  localField: '_id',
  foreignField: 'answererId',
});

// Virtual for payments
UserSchema.virtual('payments', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'userId',
});

// Virtual for notifications
UserSchema.virtual('notifications', {
  ref: 'Notification',
  localField: '_id',
  foreignField: 'userId',
});

export default mongoose.model<IUser>('User', UserSchema);
