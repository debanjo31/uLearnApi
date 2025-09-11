import mongoose, { Schema } from 'mongoose';
import type { IPayment } from '../interfaces/index.js';

const PaymentSchema: Schema = new Schema(
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
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    refundStatus: {
      type: String,
      enum: ['none', 'requested', 'processed'],
      default: 'none',
    },
    payoutDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['completed', 'failed', 'refunded'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for user details
PaymentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for course details
PaymentSchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true,
});

// Indexes for better performance
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ courseId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ refundStatus: 1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
