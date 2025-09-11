# API Documentation Guide

This guide explains how to use the Swagger/OpenAPI documentation system that has been set up for the uLearn API.

## Overview

The documentation system uses:
- **Swagger JSDoc** to parse JSDoc comments and generate OpenAPI specifications
- **Scalar** to provide a beautiful, interactive documentation interface
- Predefined schemas and helpers to maintain consistency

## Accessing Documentation

- **Development**: `http://localhost:3000/docs`
- **OpenAPI Spec**: `http://localhost:3000/openapi.json`

## How It Works

1. **Swagger comments** in route files are automatically parsed
2. The **OpenAPI specification** is generated dynamically
3. **Scalar** renders the interactive documentation
4. **Schemas** are reused across different endpoints

## Adding Documentation to New Routes

### Method 1: Using Swagger Helpers (Recommended)

```typescript
import { generateSwaggerDoc, crudTemplates } from '../utils/swaggerHelpers.js';

// For a standard CRUD operation
const createCourseDoc = generateSwaggerDoc(
  crudTemplates.create('Course', 'Courses', '#/components/schemas/CourseCreateRequest')
);

// Use the generated documentation
createCourseDoc
router.post('/', authenticate, validateRequest(courseCreateSchema), createCourse);
```

### Method 2: Manual Swagger Comments

```typescript
/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     description: Create a new course with the provided details
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseCreateRequest'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authenticate, validateRequest(courseCreateSchema), createCourse);
```

## Available Schemas

The following schemas are predefined and can be referenced using `$ref`:

### Authentication
- `#/components/schemas/User`
- `#/components/schemas/AuthResponse`
- `#/components/schemas/StudentRegistration`
- `#/components/schemas/InstructorRegistration`
- `#/components/schemas/LoginRequest`
- `#/components/schemas/ProfileUpdate`
- `#/components/schemas/PasswordChange`

### Course Management
- `#/components/schemas/Course`
- `#/components/schemas/CourseCreateRequest`
- `#/components/schemas/Section`
- `#/components/schemas/Module`
- `#/components/schemas/Enrollment`

### Common Responses
- `#/components/schemas/ApiResponse`
- `#/components/schemas/ErrorResponse`
- `#/components/schemas/PaginatedResponse`

## Adding New Schemas

To add a new schema, update the `components.schemas` section in `src/app.ts`:

```typescript
// In src/app.ts, inside the swaggerOptions.definition.components.schemas object
NewResource: {
  type: 'object',
  required: ['requiredField1', 'requiredField2'],
  properties: {
    _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
    requiredField1: { type: 'string', example: 'Example value' },
    requiredField2: { type: 'number', example: 42 },
    optionalField: { type: 'string', example: 'Optional value' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
},
```

## Common Response Patterns

Use the predefined response patterns from `swaggerHelpers.ts`:

```typescript
import { commonResponses } from '../utils/swaggerHelpers.js';

// In your route documentation
responses: {
  ...commonResponses.success200,
  ...commonResponses.unauthorized401,
  ...commonResponses.notFound404,
  ...commonResponses.serverError500
}
```

## Security

For protected routes, always include the security scheme:

```typescript
security:
  - bearerAuth: []
```

For public routes, omit the security section entirely.

## Tags

Use consistent tags to group related endpoints:

- `Authentication` - Login, registration, profile management
- `Courses` - Course CRUD operations
- `Sections` - Course section management
- `Modules` - Course module management
- `Enrollments` - Student enrollment operations
- `Reviews` - Course reviews and ratings
- `Payments` - Payment processing

## Best Practices

1. **Use descriptive summaries and descriptions**
2. **Include all possible response codes**
3. **Provide realistic examples in schemas**
4. **Group related endpoints with consistent tags**
5. **Reference existing schemas instead of defining inline**
6. **Document all request parameters and body fields**
7. **Use the helper functions to maintain consistency**

## Testing Documentation

After adding documentation to routes:

1. Start your server: `npm run dev`
2. Visit `http://localhost:3000/docs`
3. Verify your routes appear correctly
4. Test the "Try it out" functionality
5. Check that request/response schemas are correct

## Troubleshooting

### Documentation not appearing
- Check that your route file is included in the `apis` array in `app.ts`
- Verify the Swagger comment syntax is correct
- Ensure the route file is being imported in your main app

### Schema not found
- Check that the schema is defined in `app.ts`
- Verify the `$ref` path is correct
- Make sure there are no typos in schema names

### Authentication not working in docs
- Ensure the `bearerAuth` security scheme is properly configured
- Check that protected routes include the security section
- Verify JWT tokens are being passed correctly

## Example: Complete Route Documentation

Here's a complete example of documenting a new resource:

```typescript
// courseRoutes.ts
import { Router } from 'express';
import { generateSwaggerDoc, crudTemplates } from '../utils/swaggerHelpers.js';
import { authenticate } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validation.js';
import { createCourse, getCourses, getCourseById } from '../controllers/courseController.js';

const router = Router();

// Generate documentation using helpers
const createCourseDoc = generateSwaggerDoc(
  crudTemplates.create('Course', 'Courses', '#/components/schemas/CourseCreateRequest')
);

const getCoursesDoc = generateSwaggerDoc(
  crudTemplates.getAll('Course', 'Courses')
);

const getCourseByIdDoc = generateSwaggerDoc(
  crudTemplates.getById('Course', 'Courses')
);

// Apply documentation to routes
createCourseDoc
router.post('/', authenticate, validateRequest(courseCreateSchema), createCourse);

getCoursesDoc
router.get('/', authenticate, getCourses);

getCourseByIdDoc
router.get('/:id', authenticate, getCourseById);

export default router;
```

This approach ensures consistent, comprehensive documentation that automatically updates as you add new routes.
