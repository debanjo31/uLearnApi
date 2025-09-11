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
