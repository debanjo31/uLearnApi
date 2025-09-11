import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler.js';
import mongoose from 'mongoose';
import config from './config/config.js';
import { apiReference } from '@scalar/express-api-reference';
import { logger, logInfo, logError } from './utils/index.js';
import authRoutes from './routes/authRoutes.js';
import { generalLimiter } from './middlewares/rateLimiter.js';

// Connect to MongoDB
mongoose
  .connect(config.mongoUri)
  .then(() => logInfo('Connected to MongoDB'))
  .catch((err) => logError('Error connecting to MongoDB:', err));

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'http://localhost:*'],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }),
);

// CORS middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173',
          ],
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Alternative approach: Disable CSP for docs route only
app.use('/docs', (req, res, next) => {
  // Disable CSP for Scalar docs
  res.removeHeader('Content-Security-Policy');
  next();
});

app.use(
  '/docs',
  apiReference({
    theme: 'purple',
    url: 'https://cdn.jsdelivr.net/npm/@scalar/galaxy/dist/latest.json',
  }),
);

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to uLearn API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      docs: '/docs',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler for undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
