import { Router } from 'express';
import {
  createSection,
  getSections,
  getSection,
  updateSection,
  deleteSection,
  reorderSections,
} from '../controllers/sectionController.js';
import {
  createModule,
  getModules,
  getModule,
  updateModule,
  deleteModule,
  reorderModules,
} from '../controllers/moduleController.js';
import {
  validateRequest,
  createSectionSchema,
  updateSectionSchema,
  createModuleSchema,
  updateModuleSchema,
  sectionParamsSchema,
  moduleParamsSchema,
} from '../middlewares/validation.js';
import { authenticate } from '../middlewares/auth.js';
import { generalLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Section Routes
/**
 * @swagger
 * /api/content/{courseId}/sections:
 *   post:
 *     summary: Create a new section for a course
 *     description: Creates a new section within a course. Requires authentication and instructor ownership of the course.
 *     tags: [Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Getting Started"
 *               description:
 *                 type: string
 *                 example: "Introduction to the course"
 *               learningObjective:
 *                 type: string
 *                 example: "Understand basic concepts"
 *               order:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Section created successfully
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
 *                   example: "Section created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Section'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Not an instructor or not owner of the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/:courseId/sections',
  authenticate,
  generalLimiter,
  validateRequest(sectionParamsSchema),
  validateRequest(createSectionSchema),
  createSection,
);

/**
 * @swagger
 * /api/content/{courseId}/sections:
 *   get:
 *     summary: Get all sections for a course
 *     description: Retrieves all sections for a specified course.
 *     tags: [Content Management]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Sections retrieved successfully
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
 *                   example: "Sections retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Section'
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:courseId/sections',
  generalLimiter,
  validateRequest(sectionParamsSchema),
  getSections,
);

/**
 * @swagger
 * /api/content/{courseId}/sections/{sectionId}:
 *   get:
 *     summary: Get a specific section
 *     description: Retrieves a specific section by ID.
 *     tags: [Content Management]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section
 *     responses:
 *       200:
 *         description: Section retrieved successfully
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
 *                   example: "Section retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Section'
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:courseId/sections/:sectionId',
  generalLimiter,
  validateRequest(sectionParamsSchema),
  getSection,
);

/**
 * @swagger
 * /api/content/{courseId}/sections/{sectionId}:
 *   put:
 *     summary: Update a section
 *     description: Updates a section by ID. Requires authentication and instructor ownership.
 *     tags: [Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Section Title"
 *               description:
 *                 type: string
 *                 example: "Updated section description"
 *               learningObjective:
 *                 type: string
 *                 example: "Updated learning objectives"
 *               order:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Section updated successfully
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
 *                   example: "Section updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Section'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Not an instructor or not owner of the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/:courseId/sections/:sectionId',
  authenticate,
  generalLimiter,
  validateRequest(sectionParamsSchema),
  validateRequest(updateSectionSchema),
  updateSection,
);

/**
 * @swagger
 * /api/content/{courseId}/sections/{sectionId}:
 *   delete:
 *     summary: Delete a section
 *     description: Deletes a section by ID. Requires authentication and instructor ownership.
 *     tags: [Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section
 *     responses:
 *       200:
 *         description: Section deleted successfully
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
 *                   example: "Section deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Not an instructor or not owner of the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/:courseId/sections/:sectionId',
  authenticate,
  generalLimiter,
  validateRequest(sectionParamsSchema),
  deleteSection,
);

/**
 * @swagger
 * /api/content/{courseId}/sections/reorder:
 *   post:
 *     summary: Reorder sections
 *     description: Reorders sections within a course. Requires authentication and instructor ownership.
 *     tags: [Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sectionOrders
 *             properties:
 *               sectionOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     sectionId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     order:
 *                       type: number
 *                       example: 1
 *     responses:
 *       200:
 *         description: Sections reordered successfully
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
 *                   example: "Sections reordered successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Not an instructor or not owner of the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/:courseId/sections/reorder',
  authenticate,
  generalLimiter,
  validateRequest(sectionParamsSchema),
  reorderSections,
);

// Module Routes
/**
 * @swagger
 * /api/content/sections/{sectionId}/modules:
 *   post:
 *     summary: Create a new module for a section
 *     description: Creates a new module within a section. Requires authentication and instructor ownership.
 *     tags: [Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Introduction Video"
 *               type:
 *                 type: string
 *                 enum: [video, video_slide, article, quiz, assignment]
 *                 example: "video"
 *               content:
 *                 type: string
 *                 example: "https://example.com/video.mp4"
 *               order:
 *                 type: number
 *                 example: 1
 *               duration:
 *                 type: number
 *                 example: 15
 *     responses:
 *       201:
 *         description: Module created successfully
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
 *                   example: "Module created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Not an instructor or not owner of the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/sections/:sectionId/modules',
  authenticate,
  generalLimiter,
  validateRequest(moduleParamsSchema),
  validateRequest(createModuleSchema),
  createModule,
);

/**
 * @swagger
 * /api/content/sections/{sectionId}/modules:
 *   get:
 *     summary: Get all modules for a section
 *     description: Retrieves all modules for a specified section.
 *     tags: [Content Management]
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section
 *     responses:
 *       200:
 *         description: Modules retrieved successfully
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
 *                   example: "Modules retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Module'
 *       404:
 *         description: Section not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/sections/:sectionId/modules',
  generalLimiter,
  validateRequest(moduleParamsSchema),
  getModules,
);

/**
 * @swagger
 * /api/content/sections/{sectionId}/modules/{moduleId}:
 *   get:
 *     summary: Get a specific module
 *     description: Retrieves a specific module by ID.
 *     tags: [Content Management]
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the module
 *     responses:
 *       200:
 *         description: Module retrieved successfully
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
 *                   example: "Module retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *       404:
 *         description: Module not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/sections/:sectionId/modules/:moduleId',
  generalLimiter,
  validateRequest(moduleParamsSchema),
  getModule,
);

/**
 * @swagger
 * /api/content/sections/{sectionId}/modules/{moduleId}:
 *   put:
 *     summary: Update a module
 *     description: Updates a module by ID. Requires authentication and instructor ownership.
 *     tags: [Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the module
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Module Title"
 *               type:
 *                 type: string
 *                 enum: [video, video_slide, article, quiz, assignment]
 *                 example: "article"
 *               content:
 *                 type: string
 *                 example: "Updated content text or URL"
 *               order:
 *                 type: number
 *                 example: 2
 *               duration:
 *                 type: number
 *                 example: 20
 *     responses:
 *       200:
 *         description: Module updated successfully
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
 *                   example: "Module updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Not an instructor or not owner of the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Module not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(
  '/sections/:sectionId/modules/:moduleId',
  authenticate,
  generalLimiter,
  validateRequest(moduleParamsSchema),
  validateRequest(updateModuleSchema),
  updateModule,
);

/**
 * @swagger
 * /api/content/sections/{sectionId}/modules/{moduleId}:
 *   delete:
 *     summary: Delete a module
 *     description: Deletes a module by ID. Requires authentication and instructor ownership.
 *     tags: [Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the module
 *     responses:
 *       200:
 *         description: Module deleted successfully
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
 *                   example: "Module deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Not an instructor or not owner of the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Module not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(
  '/sections/:sectionId/modules/:moduleId',
  authenticate,
  generalLimiter,
  validateRequest(moduleParamsSchema),
  deleteModule,
);

/**
 * @swagger
 * /api/content/sections/{sectionId}/modules/reorder:
 *   post:
 *     summary: Reorder modules
 *     description: Reorders modules within a section. Requires authentication and instructor ownership.
 *     tags: [Content Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the section
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleOrders
 *             properties:
 *               moduleOrders:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     moduleId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     order:
 *                       type: number
 *                       example: 1
 *     responses:
 *       200:
 *         description: Modules reordered successfully
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
 *                   example: "Modules reordered successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Not an instructor or not owner of the course
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/sections/:sectionId/modules/reorder',
  authenticate,
  generalLimiter,
  validateRequest(moduleParamsSchema),
  reorderModules,
);

export default router;
