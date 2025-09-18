import { Router } from 'express';
import {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
  toggleCourseStatus,
  getCourseStats,
} from '../controllers/courseController.js';
import {
  validateRequest,
  createCourseSchema,
  updateCourseSchema,
  courseStatusSchema,
  courseQuerySchema,
  courseParamsSchema,
} from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import { generalLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f8a1b2c3d4e5f6a7b8c9d0
 *         title:
 *           type: string
 *           example: Complete JavaScript Course
 *         description:
 *           type: string
 *           example: Learn JavaScript from basics to advanced concepts
 *         category:
 *           type: string
 *           example: Programming
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           example: beginner
 *         price:
 *           type: number
 *           example: 99.99
 *         instructorId:
 *           type: string
 *           example: 64f8a1b2c3d4e5f6a7b8c9d1
 *         status:
 *           type: string
 *           enum: [draft, published, unpublished]
 *           example: published
 *         duration:
 *           type: number
 *           example: 40.5
 *         rating:
 *           type: number
 *           example: 4.5
 *         enrollmentCount:
 *           type: number
 *           example: 150
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     
 *     CourseCreate:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *         - level
 *         - price
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           example: Complete JavaScript Course
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *           example: Learn JavaScript from basics to advanced concepts
 *         category:
 *           type: string
 *           minLength: 2
 *           example: Programming
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           example: beginner
 *         price:
 *           type: number
 *           minimum: 0
 *           maximum: 9999.99
 *           example: 99.99
 *         duration:
 *           type: number
 *           minimum: 0.5
 *           maximum: 500
 *           example: 40.5
 *     
 *     CourseUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           example: Advanced JavaScript Course
 *         description:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *           example: Master advanced JavaScript concepts and patterns
 *         category:
 *           type: string
 *           minLength: 2
 *           example: Programming
 *         level:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           example: advanced
 *         price:
 *           type: number
 *           minimum: 0
 *           maximum: 9999.99
 *           example: 149.99
 *         duration:
 *           type: number
 *           minimum: 0.5
 *           maximum: 500
 *           example: 60
 *     
 *     CourseStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [draft, published, unpublished]
 *           example: published
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     description: Create a new course (instructors only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseCreate'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Course created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       403:
 *         description: Only instructors can create courses
 *       500:
 *         description: Failed to create course
 */
router.post(
  '/',
  authenticate,
  generalLimiter,
  validateRequest(createCourseSchema),
  createCourse,
);

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses with filters and pagination
 *     description: Retrieve courses with optional filtering, sorting, and pagination
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of courses per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by course category
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         description: Filter by course level
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, unpublished]
 *           default: published
 *         description: Filter by course status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in course title and description
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, title, price, rating, enrollmentCount]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Courses retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalCourses:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPrevPage:
 *                           type: boolean
 *       500:
 *         description: Failed to retrieve courses
 */
router.get('/', validateRequest(courseQuerySchema), getCourses);

/**
 * @swagger
 * /api/courses/instructor:
 *   get:
 *     summary: Get courses by authenticated instructor
 *     description: Retrieve all courses created by the authenticated instructor
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, unpublished]
 *         description: Filter by course status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of courses per page
 *     responses:
 *       200:
 *         description: Instructor courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Instructor courses retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
 *                     pagination:
 *                       type: object
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Failed to retrieve instructor courses
 */
router.get('/instructor', authenticate, getInstructorCourses);

/**
 * @swagger
 * /api/courses/stats:
 *   get:
 *     summary: Get course statistics for instructor
 *     description: Retrieve course statistics for the authenticated instructor
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Course statistics retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCourses:
 *                       type: integer
 *                       example: 5
 *                     publishedCourses:
 *                       type: integer
 *                       example: 3
 *                     draftCourses:
 *                       type: integer
 *                       example: 2
 *                     totalEnrollments:
 *                       type: integer
 *                       example: 150
 *                     averageRating:
 *                       type: number
 *                       example: 4.5
 *                     totalRevenue:
 *                       type: number
 *                       example: 2500.50
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Failed to retrieve course statistics
 */
router.get('/stats', authenticate, getCourseStats);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get a single course by ID
 *     description: Retrieve detailed information about a specific course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Course retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to retrieve course
 */
router.get('/:id', validateRequest(courseParamsSchema), getCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     description: Update course details (instructor only - own courses)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseUpdate'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Course updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       403:
 *         description: You can only update your own courses
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to update course
 */
router.put(
  '/:id',
  authenticate,
  validateRequest({ ...courseParamsSchema, ...updateCourseSchema }),
  updateCourse,
);

/**
 * @swagger
 * /api/courses/{id}/status:
 *   patch:
 *     summary: Update course status
 *     description: Publish, unpublish, or set course to draft (instructor only - own courses)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseStatusUpdate'
 *     responses:
 *       200:
 *         description: Course status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Course published successfully
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid status
 *       403:
 *         description: You can only modify your own courses
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to update course status
 */
router.patch(
  '/:id/status',
  authenticate,
  validateRequest({ ...courseParamsSchema, ...courseStatusSchema }),
  toggleCourseStatus,
);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Delete a course (instructor only - own courses, no enrollments)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Course deleted successfully
 *       400:
 *         description: Cannot delete course with active enrollments
 *       403:
 *         description: You can only delete your own courses
 *       404:
 *         description: Course not found
 *       500:
 *         description: Failed to delete course
 */
router.delete(
  '/:id',
  authenticate,
  validateRequest(courseParamsSchema),
  deleteCourse,
);

export default router;
