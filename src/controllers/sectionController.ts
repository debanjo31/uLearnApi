import type { Response } from 'express';
import Course from '../models/Course.js';
import Section from '../models/Section.js';
import { logError, logInfo } from '../utils/index.js';
import type { AuthRequest } from '../interfaces/index.js';
import mongoose from 'mongoose';

// Create a new section for a course (Instructors only)
export const createSection = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { title, description, learningObjective, order } = req.body;
    const instructorId = req.user?.id;

    // Check if user is an instructor
    if (req.user?.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can create course sections',
      });
    }

    // Check if course exists and belongs to the instructor
    const course = await Course.findOne({
      _id: courseId,
      instructorId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have permission to modify it',
      });
    }

    // Check if a section with the same order already exists
    const existingSection = await Section.findOne({
      courseId,
      order,
    });

    if (existingSection) {
      return res.status(400).json({
        success: false,
        message: `A section with order ${order} already exists. Please use a different order.`,
      });
    }

    const section = new Section({
      courseId,
      title,
      description,
      learningObjective,
      order,
    });

    await section.save();

    logInfo(`Section created: ${section.title} for course ${courseId}`);

    res.status(201).json({
      success: true,
      message: 'Section created successfully',
      data: section,
    });
  } catch (error) {
    logError('Error creating section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create section',
    });
  }
};

// Get all sections for a course
export const getSections = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    const sections = await Section.find({ courseId }).sort({ order: 1 });

    res.json({
      success: true,
      message: 'Sections retrieved successfully',
      data: sections,
    });
  } catch (error) {
    logError('Error fetching sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sections',
    });
  }
};

// Get a single section by ID
export const getSection = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, sectionId } = req.params;

    const section = await Section.findOne({
      _id: sectionId,
      courseId,
    }).populate('modules');

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    res.json({
      success: true,
      message: 'Section retrieved successfully',
      data: section,
    });
  } catch (error) {
    logError('Error fetching section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve section',
    });
  }
};

// Update a section (Instructor only)
export const updateSection = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, sectionId } = req.params;
    const updates = req.body;
    const instructorId = req.user?.id;

    // Check if user is an instructor
    if (req.user?.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can update course sections',
      });
    }

    // Check if course exists and belongs to the instructor
    const course = await Course.findOne({
      _id: courseId,
      instructorId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have permission to modify it',
      });
    }

    // If updating the order, check if another section already has this order
    if (updates.order) {
      const existingSection = await Section.findOne({
        courseId,
        order: updates.order,
        _id: { $ne: sectionId },
      });

      if (existingSection) {
        return res.status(400).json({
          success: false,
          message: `A section with order ${updates.order} already exists. Please use a different order.`,
        });
      }
    }

    const section = await Section.findOneAndUpdate(
      { _id: sectionId, courseId },
      updates,
      { new: true, runValidators: true },
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    logInfo(`Section updated: ${section.title} for course ${courseId}`);

    res.json({
      success: true,
      message: 'Section updated successfully',
      data: section,
    });
  } catch (error) {
    logError('Error updating section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update section',
    });
  }
};

// Delete a section (Instructor only)
export const deleteSection = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, sectionId } = req.params;
    const instructorId = req.user?.id;

    // Check if user is an instructor
    if (req.user?.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can delete course sections',
      });
    }

    // Check if course exists and belongs to the instructor
    const course = await Course.findOne({
      _id: courseId,
      instructorId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have permission to modify it',
      });
    }

    // Use a transaction to delete the section and its modules
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete section
      const section = await Section.findOneAndDelete({
        _id: sectionId,
        courseId,
      }).session(session);

      if (!section) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          message: 'Section not found',
        });
      }

      // Delete all modules in this section
      await mongoose
        .model('Module')
        .deleteMany({
          sectionId: sectionId,
        })
        .session(session);

      await session.commitTransaction();
      session.endSession();

      logInfo(`Section deleted: ${section.title} from course ${courseId}`);

      res.json({
        success: true,
        message: 'Section and its modules deleted successfully',
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    logError('Error deleting section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete section',
    });
  }
};

// Reorder sections
export const reorderSections = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const { sectionOrders } = req.body; // Array of { sectionId, order }
    const instructorId = req.user?.id;

    // Check if user is an instructor
    if (req.user?.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can reorder course sections',
      });
    }

    // Check if course exists and belongs to the instructor
    const course = await Course.findOne({
      _id: courseId,
      instructorId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have permission to modify it',
      });
    }

    // Validate the input
    if (!Array.isArray(sectionOrders) || sectionOrders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section orders provided',
      });
    }

    // Update each section with its new order
    const updatePromises = sectionOrders.map(({ sectionId, order }) => {
      return Section.findOneAndUpdate(
        { _id: sectionId, courseId },
        { order },
        { new: true, runValidators: true },
      );
    });

    const updatedSections = await Promise.all(updatePromises);

    // Check if any section was not found
    const notFoundSections = updatedSections.filter((section) => !section);
    if (notFoundSections.length > 0) {
      return res.status(404).json({
        success: false,
        message: 'One or more sections not found',
      });
    }

    logInfo(`Sections reordered for course ${courseId}`);

    res.json({
      success: true,
      message: 'Sections reordered successfully',
      data: updatedSections,
    });
  } catch (error) {
    logError('Error reordering sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder sections',
    });
  }
};
