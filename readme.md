Subpath imports in Node.js are shortcuts that map custom names to specific directory paths in your project. They help avoid lengthy relative paths and make imports more maintainable.

For example, in a larger project, you may encounter nested folders.

We can fix this by adding an “import” option in our package.json file.# uLearn API

A comprehensive RESTful API for an online learning platform similar to Udemy. This backend powers course creation, user management, enrollment, and content delivery.

## 🚀 Features

### Authentication & User Management
- User registration (students and instructors)
- JWT-based authentication
- Role-based authorization
- Password encryption with bcrypt
- Profile management

### Course Management
- Course CRUD operations
- Category and level filtering
- Pricing options
- Course status management (draft, published, unpublished)
- Rating system

### Content Management
- Section creation and organization
- Module management (videos, articles, quizzes, assignments)
- Content ordering within courses
- Resource attachments

### Future Implementations
- Enrollment tracking
- Payment processing
- Reviews and ratings
- Question & Answer system
- Notifications

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety and developer experience
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication
- **Zod** - Input validation
- **Winston** - Logging
- **Swagger/OpenAPI** - API documentation
- **Jest/Vitest** - Testing framework

## 📝 API Documentation

API documentation is available at `/docs` when the server is running. The documentation is automatically generated from the JSDoc comments in the codebase using swagger-jsdoc.

## 🏗️ Project Structure

```
uLearnApi/
├── src/                  # Source code
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── interfaces/       # TypeScript interfaces
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # Route definitions
│   ├── utils/            # Utility functions
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── __tests__/            # Test files
├── .env                  # Environment variables (create from .env.example)
├── .env.example          # Example environment variables
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://your-repository-url.git
   cd uLearnApi
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```bash
   cp .env.example .env
   ```
   
4. Update the `.env` file with your configuration values

### Running the Server

Development mode with hot reload:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register/student` - Register a new student
- `POST /api/auth/register/instructor` - Register a new instructor
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `POST /api/auth/logout` - Logout user

### Courses

- `POST /api/courses` - Create a new course
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `GET /api/courses/instructor` - Get instructor's courses

### Content Management

- `POST /api/content/:courseId/sections` - Create a section
- `GET /api/content/:courseId/sections` - Get all sections for a course
- `GET /api/content/:courseId/sections/:sectionId` - Get section by ID
- `PUT /api/content/:courseId/sections/:sectionId` - Update section
- `DELETE /api/content/:courseId/sections/:sectionId` - Delete section
- `POST /api/content/:courseId/sections/reorder` - Reorder sections

- `POST /api/content/sections/:sectionId/modules` - Create a module
- `GET /api/content/sections/:sectionId/modules` - Get all modules for a section
- `GET /api/content/sections/:sectionId/modules/:moduleId` - Get module by ID
- `PUT /api/content/sections/:sectionId/modules/:moduleId` - Update module
- `DELETE /api/content/sections/:sectionId/modules/:moduleId` - Delete module
- `POST /api/content/sections/:sectionId/modules/reorder` - Reorder modules

## 🔐 Environment Variables

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ulearn
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

## 📈 Import Aliases

This project uses import aliases to avoid lengthy relative paths. The aliases are configured in `package.json` under the "imports" field:

```json
"imports": {
  "#config/*": "./dist/config/*",
  "#controllers/*": "./dist/controllers/*",
  "#interfaces/*": "./dist/interfaces/*",
  "#middlewares/*": "./dist/middlewares/*",
  "#models/*": "./dist/models/*",
  "#routes/*": "./dist/routes/*",
  "#utils/*": "./dist/utils/*"
}
```

Example usage:
```typescript
import { config } from "#config/config.js";
import { authenticate } from "#middlewares/auth.js";
```

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📜 License

[MIT](LICENSE)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!