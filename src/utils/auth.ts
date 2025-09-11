import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import type { IJwtPayload } from '../interfaces/index.js';

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.bcryptSaltRounds);
};

/**
 * Compare a password with its hash
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate JWT access token
 */
export const generateAccessToken = (
  payload: Omit<IJwtPayload, 'iat' | 'exp'>,
): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (
  payload: Omit<IJwtPayload, 'iat' | 'exp'>,
): string => {
  return jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpiresIn,
  });
};

/**
 * Verify JWT access token
 */
export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwtSecret) as IJwtPayload;
};

/**
 * Verify JWT refresh token
 */
export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, config.jwtRefreshSecret) as IJwtPayload;
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (payload: Omit<IJwtPayload, 'iat' | 'exp'>) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (
  authHeader: string | undefined,
): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1] || null;
};
