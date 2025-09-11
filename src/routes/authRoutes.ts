import { Router } from 'express';
import {
  registerStudent,
  registerInstructor,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
} from '../controllers/authController.js';
import {
  validateRequest,
  studentRegistrationSchema,
  instructorRegistrationSchema,
  loginSchema,
  passwordChangeSchema,
  profileUpdateSchema,
} from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import {
  authLimiter,
  passwordResetLimiter,
} from '../middlewares/rateLimiter.js';

const router = Router();

/**
 * @route   POST /api/auth/register/student
 * @desc    Register a new student
 * @access  Public
 */
router.post(
  '/register/student',
  authLimiter,
  validateRequest(studentRegistrationSchema),
  registerStudent,
);

/**
 * @route   POST /api/auth/register/instructor
 * @desc    Register a new instructor
 * @access  Public
 */
router.post(
  '/register/instructor',
  authLimiter,
  validateRequest(instructorRegistrationSchema),
  registerInstructor,
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user (student or instructor)
 * @access  Public
 */
router.post('/login', authLimiter, validateRequest(loginSchema), login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  authenticate,
  validateRequest(profileUpdateSchema),
  updateProfile,
);

/**
 * @route   PUT /api/auth/password
 * @desc    Change user password
 * @access  Private
 */
router.put(
  '/password',
  authenticate,
  passwordResetLimiter,
  validateRequest(passwordChangeSchema),
  changePassword,
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

export default router;
