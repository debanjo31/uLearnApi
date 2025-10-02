import type { Request, Response } from 'express';
import Course from '../models/Course.js';
import { logError, logInfo } from '../utils/index.js';
import type { AuthRequest } from '../interfaces/index.js';

// Create a new course (Instructors only)
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, level, price, duration } = req.body;
    const instructorId = req.user?.id;

    // Check if user is an instructor
    if (req.user?.role !== 'instructor') {
      return res.status(403).json({
        success: false,
        message: 'Only instructors can create courses',
      });
    }

    const course = new Course({
      title,
      description,
      category,
      level,
      price,
      duration,
      instructorId,
    });

    await course.save();

    logInfo(`Course created: ${course.title} by instructor ${instructorId}`);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    logError('Error creating course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
    });
  }
};

// Get all courses with pagination and filters
export const getCourses = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      level,
      status = 'published',
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = {};

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (status) filter.status = status;

    if (search) {
      filter.$text = { $search: search as string };
    }

    // Sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate('instructor', 'name profilePicture')
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Course.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: 'Courses retrieved successfully',
      data: {
        courses,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCourses: total,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    logError('Error fetching courses:', error);
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve courses',
    });
  }
};

// Get courses by instructor (for instructor dashboard)
export const getInstructorCourses = async (req: AuthRequest, res: Response) => {
  try {
    const instructorId = req.user?.id;
    const { status, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = { instructorId };
    if (status) filter.status = status;

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Course.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      message: 'Instructor courses retrieved successfully',
      data: {
        courses,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCourses: total,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    logError('Error fetching instructor courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve instructor courses',
    });
  }
};

// Get a single course by ID
export const getCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate('instructor', 'name bio profilePicture')
      .populate('sections')
      .lean();

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.json({
      success: true,
      message: 'Course retrieved successfully',
      data: course,
    });
  } catch (error) {
    logError('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve course',
    });
  }
};

// Update a course (Instructor only - own courses)
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const instructorId = req.user?.id;
    const updates = req.body;

    // Find the course and check ownership
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if the instructor owns this course
    if (course.instructorId.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own courses',
      });
    }

    // Don't allow updating instructorId
    delete updates.instructorId;

    const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('instructor', 'name profilePicture');

    logInfo(
      `Course updated: ${updatedCourse?.title} by instructor ${instructorId}`,
    );

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    logError('Error updating course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
    });
  }
};

// Delete a course (Instructor only - own courses)
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const instructorId = req.user?.id;

    // Find the course and check ownership
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if the instructor owns this course
    if (course.instructorId.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own courses',
      });
    }

    // Check if course has enrollments
    if (course.enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete course with active enrollments',
      });
    }

    await Course.findByIdAndDelete(id);

    logInfo(`Course deleted: ${course.title} by instructor ${instructorId}`);

    res.json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    logError('Error deleting course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
    });
  }
};

// Publish/Unpublish a course
export const toggleCourseStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const instructorId = req.user?.id;

    if (!['published', 'unpublished', 'draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be published, unpublished, or draft',
      });
    }

    // Find the course and check ownership
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Check if the instructor owns this course
    if (course.instructorId.toString() !== instructorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only modify your own courses',
      });
    }

    course.status = status;
    await course.save();

    logInfo(
      `Course status changed to ${status}: ${course.title} by instructor ${instructorId}`,
    );

    res.json({
      success: true,
      message: `Course ${status} successfully`,
      data: course,
    });
  } catch (error) {
    logError('Error updating course status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course status',
    });
  }
};

// Get course statistics (for instructor dashboard)
export const getCourseStats = async (req: AuthRequest, res: Response) => {
  try {
    const instructorId = req.user?.id;

    const stats = await Course.aggregate([
      { $match: { instructorId: instructorId } },
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          publishedCourses: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] },
          },
          draftCourses: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] },
          },
          totalEnrollments: { $sum: '$enrollmentCount' },
          averageRating: { $avg: '$rating' },
          totalRevenue: { $sum: { $multiply: ['$price', '$enrollmentCount'] } },
        },
      },
    ]);

    const result = stats[0] || {
      totalCourses: 0,
      publishedCourses: 0,
      draftCourses: 0,
      totalEnrollments: 0,
      averageRating: 0,
      totalRevenue: 0,
    };

    res.json({
      success: true,
      message: 'Course statistics retrieved successfully',
      data: result,
    });
  } catch (error) {
    logError('Error fetching course statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve course statistics',
    });
  }
};
