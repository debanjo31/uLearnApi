import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/auth.js';
import { User } from '../models/index.js';
import type { IUser, IJwtPayload } from '../interfaces/index.js';
import { logError } from '../utils/index.js';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      userId?: string;
    }
  }
}

/**
 * Authentication middleware - verifies JWT token
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    // Verify the token
    const decoded = verifyAccessToken(token) as IJwtPayload;

    // Find the user
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - user not found',
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (error: any) {
    logError('Authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

/**
 * Authorization middleware - checks user roles
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyAccessToken(token) as IJwtPayload;
      const user = await User.findById(decoded.userId).select('-password');

      if (user) {
        req.user = user;
        req.userId = user._id.toString();
      }
    }

    next();
  } catch (error) {
    // If optional auth fails, continue without user
    next();
  }
};
