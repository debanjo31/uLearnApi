import mongoose, { Schema } from 'mongoose';
import type { ISection } from '../interfaces/index.js';

const SectionSchema: Schema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    learningObjective: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for course details
SectionSchema.virtual('course', {
  ref: 'Course',
  localField: 'courseId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for modules
SectionSchema.virtual('modules', {
  ref: 'Module',
  localField: '_id',
  foreignField: 'sectionId',
});

// Virtual for resources
SectionSchema.virtual('resources', {
  ref: 'Resource',
  localField: '_id',
  foreignField: 'sectionId',
});

// Indexes for better performance
SectionSchema.index({ courseId: 1, order: 1 });
SectionSchema.index({ courseId: 1 });

export default mongoose.model<ISection>('Section', SectionSchema);
