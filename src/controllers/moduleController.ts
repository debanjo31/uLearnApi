import type { Response } from 'express';
import Section from '../models/Section.js';
import Module from '../models/Module.js';
import Course from '../models/Course.js';
import { logError, logInfo } from '../utils/index.js';
import type { AuthRequest } from '../interfaces/index.js';

// Create a new module for a section (Instructors only)
export const createModule = async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { title, type, content, order, duration } = req.body;
    const instructorId = req.user?.id;

    // Check if user is an instructor
    if (req.user?.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can create modules',
      });
    }

    // Check if section exists
    const section = await Section.findById(sectionId).populate('courseId');

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Check if course belongs to the instructor
    const course = await Course.findOne({
      _id: section.courseId,
      instructorId,
    });

    if (!course) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this course',
      });
    }

    // Check if a module with the same order already exists
    const existingModule = await Module.findOne({
      sectionId,
      order,
    });

    if (existingModule) {
      return res.status(400).json({
        success: false,
        message: `A module with order ${order} already exists. Please use a different order.`,
      });
    }

    const module = new Module({
      sectionId,
      title,
      type,
      content,
      order,
      duration,
    });

    await module.save();

    logInfo(`Module created: ${module.title} for section ${sectionId}`);

    res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: module,
    });
  } catch (error) {
    logError('Error creating module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create module',
    });
  }
};

// Get all modules for a section
export const getModules = async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId } = req.params;

    // Check if section exists
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    const modules = await Module.find({ sectionId }).sort({ order: 1 });

    res.json({
      success: true,
      message: 'Modules retrieved successfully',
      data: modules,
    });
  } catch (error) {
    logError('Error fetching modules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve modules',
    });
  }
};

// Get a single module by ID
export const getModule = async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId, moduleId } = req.params;

    const module = await Module.findOne({
      _id: moduleId,
      sectionId,
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
      });
    }

    res.json({
      success: true,
      message: 'Module retrieved successfully',
      data: module,
    });
  } catch (error) {
    logError('Error fetching module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve module',
    });
  }
};

// Update a module (Instructor only)
export const updateModule = async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId, moduleId } = req.params;
    const updates = req.body;
    const instructorId = req.user?.id;

    // Check if user is an instructor
    if (req.user?.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can update modules',
      });
    }

    // Check if section exists
    const section = await Section.findById(sectionId).populate('courseId');

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Check if course belongs to the instructor
    const course = await Course.findOne({
      _id: section.courseId,
      instructorId,
    });

    if (!course) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this course',
      });
    }

    // If updating the order, check if another module already has this order
    if (updates.order) {
      const existingModule = await Module.findOne({
        sectionId,
        order: updates.order,
        _id: { $ne: moduleId },
      });

      if (existingModule) {
        return res.status(400).json({
          success: false,
          message: `A module with order ${updates.order} already exists. Please use a different order.`,
        });
      }
    }

    const module = await Module.findOneAndUpdate(
      { _id: moduleId, sectionId },
      updates,
      { new: true, runValidators: true },
    );

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
      });
    }

    logInfo(`Module updated: ${module.title} for section ${sectionId}`);

    res.json({
      success: true,
      message: 'Module updated successfully',
      data: module,
    });
  } catch (error) {
    logError('Error updating module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update module',
    });
  }
};

// Delete a module (Instructor only)
export const deleteModule = async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId, moduleId } = req.params;
    const instructorId = req.user?.id;

    // Check if user is an instructor
    if (req.user?.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can delete modules',
      });
    }

    // Check if section exists
    const section = await Section.findById(sectionId).populate('courseId');

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Check if course belongs to the instructor
    const course = await Course.findOne({
      _id: section.courseId,
      instructorId,
    });

    if (!course) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this course',
      });
    }

    const module = await Module.findOneAndDelete({
      _id: moduleId,
      sectionId,
    });

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found',
      });
    }

    logInfo(`Module deleted: ${module.title} from section ${sectionId}`);

    res.json({
      success: true,
      message: 'Module deleted successfully',
    });
  } catch (error) {
    logError('Error deleting module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete module',
    });
  }
};

// Reorder modules
export const reorderModules = async (req: AuthRequest, res: Response) => {
  try {
    const { sectionId } = req.params;
    const { moduleOrders } = req.body; // Array of { moduleId, order }
    const instructorId = req.user?.id;

    // Check if user is an instructor
    if (req.user?.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can reorder modules',
      });
    }

    // Check if section exists
    const section = await Section.findById(sectionId).populate('courseId');

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found',
      });
    }

    // Check if course belongs to the instructor
    const course = await Course.findOne({
      _id: section.courseId,
      instructorId,
    });

    if (!course) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this course',
      });
    }

    // Validate the input
    if (!Array.isArray(moduleOrders) || moduleOrders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid module orders provided',
      });
    }

    // Update each module with its new order
    const updatePromises = moduleOrders.map(({ moduleId, order }) => {
      return Module.findOneAndUpdate(
        { _id: moduleId, sectionId },
        { order },
        { new: true, runValidators: true },
      );
    });

    const updatedModules = await Promise.all(updatePromises);

    // Check if any module was not found
    const notFoundModules = updatedModules.filter((module) => !module);
    if (notFoundModules.length > 0) {
      return res.status(404).json({
        success: false,
        message: 'One or more modules not found',
      });
    }

    logInfo(`Modules reordered for section ${sectionId}`);

    res.json({
      success: true,
      message: 'Modules reordered successfully',
      data: updatedModules,
    });
  } catch (error) {
    logError('Error reordering modules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder modules',
    });
  }
};
