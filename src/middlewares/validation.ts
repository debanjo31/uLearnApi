import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

/**
 * Validation middleware wrapper for Zod schemas
 */
export const validateRequest = (schema: {
  body?: z.ZodSchema;
  query?: z.ZodSchema;
  params?: z.ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }

      // Validate query
      if (schema.query) {
        const parsedQuery = schema.query.parse(req.query);
        req.query = parsedQuery as any;
      }

      // Validate params
      if (schema.params) {
        const parsedParams = schema.params.parse(req.params);
        req.params = parsedParams as any;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.issues.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal validation error',
      });
    }
  };
};

/**
 * Password validation schema
 */
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  );

/**
 * Student registration validation schema
 */
export const studentRegistrationSchema = {
  body: z.object({
    email: z
      .string()
      .email('Please provide a valid email address')
      .toLowerCase(),

    password: passwordSchema,

    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must not exceed 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
      .transform((str) => str.trim()),
  }),
};

/**
 * Instructor registration validation schema
 */
export const instructorRegistrationSchema = {
  body: z.object({
    email: z
      .string()
      .email('Please provide a valid email address')
      .toLowerCase(),

    password: passwordSchema,

    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must not exceed 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
      .transform((str) => str.trim()),

    bio: z
      .string()
      .max(500, 'Bio must not exceed 500 characters')
      .transform((str) => str.trim())
      .optional(),
  }),
};

/**
 * Login validation schema
 */
export const loginSchema = {
  body: z.object({
    email: z
      .string()
      .email('Please provide a valid email address')
      .toLowerCase(),

    password: z.string().min(1, 'Password is required'),
  }),
};

/**
 * Password change validation schema
 */
export const passwordChangeSchema = {
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),

    newPassword: passwordSchema,
  }),
};

/**
 * Profile update validation schema
 */
export const profileUpdateSchema = {
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must not exceed 50 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
      .transform((str) => str.trim())
      .optional(),

    bio: z
      .string()
      .max(500, 'Bio must not exceed 500 characters')
      .transform((str) => str.trim())
      .optional(),

    profilePicture: z
      .string()
      .url('Profile picture must be a valid URL')
      .optional(),
  }),
};

/**
 * Course creation validation schema
 */
export const createCourseSchema = {
  body: z.object({
    title: z
      .string()
      .min(3, 'Course title must be at least 3 characters long')
      .max(200, 'Course title must not exceed 200 characters')
      .transform((str) => str.trim()),

    description: z
      .string()
      .min(10, 'Course description must be at least 10 characters long')
      .max(2000, 'Course description must not exceed 2000 characters')
      .transform((str) => str.trim()),

    category: z
      .string()
      .min(2, 'Category must be at least 2 characters long')
      .transform((str) => str.trim()),

    level: z.enum(['beginner', 'intermediate', 'advanced'], {
      message: 'Level must be beginner, intermediate, or advanced',
    }),

    price: z
      .number()
      .min(0, 'Price cannot be negative')
      .max(9999.99, 'Price cannot exceed $9999.99'),

    duration: z
      .number()
      .min(0.5, 'Duration must be at least 0.5 hours')
      .max(500, 'Duration cannot exceed 500 hours')
      .optional(),
  }),
};

/**
 * Course update validation schema
 */
export const updateCourseSchema = {
  body: z.object({
    title: z
      .string()
      .min(3, 'Course title must be at least 3 characters long')
      .max(200, 'Course title must not exceed 200 characters')
      .transform((str) => str.trim())
      .optional(),

    description: z
      .string()
      .min(10, 'Course description must be at least 10 characters long')
      .max(2000, 'Course description must not exceed 2000 characters')
      .transform((str) => str.trim())
      .optional(),

    category: z
      .string()
      .min(2, 'Category must be at least 2 characters long')
      .transform((str) => str.trim())
      .optional(),

    level: z
      .enum(['beginner', 'intermediate', 'advanced'], {
        message: 'Level must be beginner, intermediate, or advanced',
      })
      .optional(),

    price: z
      .number()
      .min(0, 'Price cannot be negative')
      .max(9999.99, 'Price cannot exceed $9999.99')
      .optional(),

    duration: z
      .number()
      .min(0.5, 'Duration must be at least 0.5 hours')
      .max(500, 'Duration cannot exceed 500 hours')
      .optional(),
  }),
};

/**
 * Course status update validation schema
 */
export const courseStatusSchema = {
  body: z.object({
    status: z.enum(['draft', 'published', 'unpublished'], {
      message: 'Status must be draft, published, or unpublished',
    }),
  }),
};

/**
 * Course query validation schema
 */
export const courseQuerySchema = {
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, 'Page must be a positive number')
      .optional(),
    limit: z
      .string()
      .regex(/^\d+$/, 'Limit must be a positive number')
      .optional(),
    category: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    status: z.enum(['draft', 'published', 'unpublished']).optional(),
    search: z.string().optional(),
    sortBy: z
      .enum(['createdAt', 'title', 'price', 'rating', 'enrollmentCount'])
      .optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
};

/**
 * Course ID parameter validation schema
 */
export const courseParamsSchema = {
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID format'),
  }),
};

/**
 * Section creation validation schema
 */
export const createSectionSchema = {
  body: z.object({
    title: z
      .string()
      .min(3, 'Section title must be at least 3 characters long')
      .max(200, 'Section title must not exceed 200 characters')
      .transform((str) => str.trim()),

    description: z
      .string()
      .max(1000, 'Section description must not exceed 1000 characters')
      .transform((str) => str.trim())
      .optional(),

    learningObjective: z
      .string()
      .max(500, 'Learning objective must not exceed 500 characters')
      .transform((str) => str.trim())
      .optional(),

    order: z
      .number()
      .int('Order must be a whole number')
      .min(1, 'Order must be at least 1'),
  }),
};

/**
 * Section update validation schema
 */
export const updateSectionSchema = {
  body: z.object({
    title: z
      .string()
      .min(3, 'Section title must be at least 3 characters long')
      .max(200, 'Section title must not exceed 200 characters')
      .transform((str) => str.trim())
      .optional(),

    description: z
      .string()
      .max(1000, 'Section description must not exceed 1000 characters')
      .transform((str) => str.trim())
      .optional(),

    learningObjective: z
      .string()
      .max(500, 'Learning objective must not exceed 500 characters')
      .transform((str) => str.trim())
      .optional(),

    order: z
      .number()
      .int('Order must be a whole number')
      .min(1, 'Order must be at least 1')
      .optional(),
  }),
};

/**
 * Module creation validation schema
 */
export const createModuleSchema = {
  body: z.object({
    title: z
      .string()
      .min(3, 'Module title must be at least 3 characters long')
      .max(200, 'Module title must not exceed 200 characters')
      .transform((str) => str.trim()),

    type: z.enum(['video', 'video_slide', 'article', 'quiz', 'assignment'], {
      message: 'Type must be video, video_slide, article, quiz, or assignment',
    }),

    content: z
      .string()
      .min(1, 'Content is required')
      .transform((str) => str.trim()),

    order: z
      .number()
      .int('Order must be a whole number')
      .min(1, 'Order must be at least 1'),

    duration: z.number().min(0, 'Duration must be non-negative').optional(),
  }),
};

/**
 * Module update validation schema
 */
export const updateModuleSchema = {
  body: z.object({
    title: z
      .string()
      .min(3, 'Module title must be at least 3 characters long')
      .max(200, 'Module title must not exceed 200 characters')
      .transform((str) => str.trim())
      .optional(),

    type: z
      .enum(['video', 'video_slide', 'article', 'quiz', 'assignment'], {
        message:
          'Type must be video, video_slide, article, quiz, or assignment',
      })
      .optional(),

    content: z
      .string()
      .min(1, 'Content is required')
      .transform((str) => str.trim())
      .optional(),

    order: z
      .number()
      .int('Order must be a whole number')
      .min(1, 'Order must be at least 1')
      .optional(),

    duration: z.number().min(0, 'Duration must be non-negative').optional(),
  }),
};

/**
 * Section and Module ID parameter validation schema
 */
export const sectionParamsSchema = {
  params: z.object({
    courseId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid course ID format'),
    sectionId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid section ID format')
      .optional(),
  }),
};

export const moduleParamsSchema = {
  params: z.object({
    sectionId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid section ID format'),
    moduleId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid module ID format')
      .optional(),
  }),
};
