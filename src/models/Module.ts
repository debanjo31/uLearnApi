import mongoose, { Schema } from 'mongoose';
import type { IModule } from '../interfaces/index.js';

const ModuleSchema: Schema = new Schema(
  {
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    type: {
      type: String,
      enum: ['video', 'video_slide', 'article', 'quiz', 'assignment'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    duration: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for section details
ModuleSchema.virtual('section', {
  ref: 'Section',
  localField: 'sectionId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for resources
ModuleSchema.virtual('resources', {
  ref: 'Resource',
  localField: '_id',
  foreignField: 'moduleId',
});

// Indexes for better performance
ModuleSchema.index({ sectionId: 1, order: 1 });
ModuleSchema.index({ sectionId: 1 });
ModuleSchema.index({ type: 1 });

export default mongoose.model<IModule>('Module', ModuleSchema);
