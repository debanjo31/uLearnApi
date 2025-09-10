import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middlewares/errorHandler.js';
import mongoose from 'mongoose';
import config from './config/config.js';
import { apiReference } from '@scalar/express-api-reference';
import { logger, logInfo, logError } from './utils/index.js';

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

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
