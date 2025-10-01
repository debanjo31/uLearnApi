// Generate OpenAPI spec inline
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'uLearn API',
      version: '1.0.0',
      description: 'API documentation for uLearn platform',
      contact: {
        name: 'uLearn API Support',
        email: 'support@ulearn.com',
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://your-production-url.com'
            : 'http://localhost:5000',
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            name: { type: 'string', example: 'John Doe' },
            role: {
              type: 'string',
              enum: ['student', 'instructor', 'admin'],
              example: 'student',
            },
            bio: { type: 'string', example: 'Passionate learner' },
            profilePicture: {
              type: 'string',
              example: 'https://example.com/avatar.jpg',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful' },
            data: {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                refreshToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
              },
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            error: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred' },
            error: { type: 'string', example: 'Detailed error message' },
          },
        },
        StudentRegistration: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'tunde@gmail.com',
            },
            password: { type: 'string', minLength: 6, example: 'Pass1234;' },
            name: { type: 'string', example: 'Tunde Akintunde' },
          },
        },
        InstructorRegistration: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'brad@example.com',
            },
            password: { type: 'string', minLength: 6, example: 'Pass1234$' },
            name: { type: 'string', example: 'Brad Pitt' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: { type: 'string', example: 'Pass1234$' },
          },
        },
        ProfileUpdate: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Updated Name' },
            bio: { type: 'string', example: 'Updated bio' },
            profilePicture: {
              type: 'string',
              example: 'https://example.com/new-avatar.jpg',
            },
          },
        },
        PasswordChange: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', example: 'oldPass1234$' },
            newPassword: {
              type: 'string',
              minLength: 6,
              example: 'newPass1234$',
            },
          },
        },
        Course: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'Introduction to JavaScript' },
            description: {
              type: 'string',
              example: 'Learn the basics of JavaScript programming',
            },
            category: { type: 'string', example: 'Programming' },
            level: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced'],
              example: 'beginner',
            },
            price: { type: 'number', example: 99.99 },
            instructorId: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            status: {
              type: 'string',
              enum: ['draft', 'published', 'unpublished'],
              example: 'published',
            },
            duration: { type: 'number', example: 40 },
            rating: { type: 'number', example: 4.5 },
            enrollmentCount: { type: 'number', example: 150 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        CourseCreateRequest: {
          type: 'object',
          required: ['title', 'description', 'category', 'level', 'price'],
          properties: {
            title: { type: 'string', example: 'Introduction to JavaScript' },
            description: {
              type: 'string',
              example: 'Learn the basics of JavaScript programming',
            },
            category: { type: 'string', example: 'Programming' },
            level: {
              type: 'string',
              enum: ['beginner', 'intermediate', 'advanced'],
              example: 'beginner',
            },
            price: { type: 'number', example: 99.99 },
          },
        },
        Section: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            courseId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'Getting Started' },
            description: {
              type: 'string',
              example: 'Introduction to the course',
            },
            learningObjective: {
              type: 'string',
              example: 'Understand basic concepts',
            },
            order: { type: 'number', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Module: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            sectionId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'Introduction Video' },
            type: {
              type: 'string',
              enum: ['video', 'video_slide', 'article', 'quiz', 'assignment'],
              example: 'video',
            },
            content: {
              type: 'string',
              example: 'https://example.com/video.mp4',
            },
            order: { type: 'number', example: 1 },
            duration: { type: 'number', example: 15 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Enrollment: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            courseId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            enrollmentDate: { type: 'string', format: 'date-time' },
            progress: { type: 'number', example: 75 },
            paymentStatus: {
              type: 'string',
              enum: ['pending', 'paid', 'free'],
              example: 'paid',
            },
            certificateUrl: {
              type: 'string',
              example: 'https://example.com/certificate.pdf',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Data retrieved successfully' },
            data: {
              type: 'array',
              items: { type: 'object' },
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: { type: 'number', example: 1 },
                totalPages: { type: 'number', example: 10 },
                totalItems: { type: 'number', example: 95 },
                hasNextPage: { type: 'boolean', example: true },
                hasPrevPage: { type: 'boolean', example: false },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/app.ts'],
};
