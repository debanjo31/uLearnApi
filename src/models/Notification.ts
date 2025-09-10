import mongoose, { Schema } from 'mongoose';
import type { INotification } from '../interfaces/index.js';

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['announcement', 'update', 'reply'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['sent', 'read'],
      default: 'sent',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for user details
NotificationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Indexes for better performance
NotificationSchema.index({ userId: 1, status: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ type: 1 });

export default mongoose.model<INotification>(
  'Notification',
  NotificationSchema,
);
