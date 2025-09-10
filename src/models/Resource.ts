import mongoose, { Schema } from 'mongoose';
import type { IResource } from '../interfaces/index.js';

const ResourceSchema: Schema = new Schema(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'Module',
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['pdf', 'link', 'code', 'slide'],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for section details
ResourceSchema.virtual('section', {
  ref: 'Section',
  localField: 'sectionId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for module details
ResourceSchema.virtual('module', {
  ref: 'Module',
  localField: 'moduleId',
  foreignField: '_id',
  justOne: true,
});

// Validation to ensure either sectionId or moduleId is provided
ResourceSchema.pre('validate', function (next) {
  if (!this.sectionId && !this.moduleId) {
    const error = new Error('Either sectionId or moduleId must be provided');
    return next(error);
  }
  if (this.sectionId && this.moduleId) {
    const error = new Error('Cannot have both sectionId and moduleId');
    return next(error);
  }
  next();
});

// Indexes for better performance
ResourceSchema.index({ sectionId: 1 });
ResourceSchema.index({ moduleId: 1 });
ResourceSchema.index({ type: 1 });

export default mongoose.model<IResource>('Resource', ResourceSchema);
