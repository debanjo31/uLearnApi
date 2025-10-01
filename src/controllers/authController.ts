import type { Request, Response } from 'express';
import { User } from '../models/index.js';
import {
  hashPassword,
  comparePassword,
  generateTokens,
} from '../utils/auth.js';
import { logInfo, logError } from '../utils/index.js';
import type {
  IUser,
  IAuthResponse,
  IApiResponse,
} from '../interfaces/index.js';

// Student Registration
export const registerStudent = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create student user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: 'student',
    });

    await user.save();

    logInfo(`New student registered: ${email}`);

    // Generate totkens
    const tokens = generateTokens({
      userId: (user._id as string).toString(),
      email: user.email,
      role: user.role,
    });

    // Create user response without password
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const response: IApiResponse<IAuthResponse> = {
      success: true,
      message: 'Student registered successfully',
      data: {
        user: userResponse as IUser,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };

    res.status(201).json(response);
  } catch (error: any) {
    logError('Student registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

// Instructor Registration
export const registerInstructor = async (req: Request, res: Response) => {
  try {
    const { email, password, name, bio } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create instructor user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role: 'instructor',
      bio: bio || '',
    });

    await user.save();

    logInfo(`New instructor registered: ${email}`);

    // Generate tokens
    const tokens = generateTokens({
      userId: (user._id as string).toString(),
      email: user.email,
      role: user.role,
    });

    // Create user response without password
    const userResponse = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const response: IApiResponse<IAuthResponse> = {
      success: true,
      message: 'Instructor registered successfully',
      data: {
        user: userResponse as IUser,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };

    res.status(201).json(response);
  } catch (error: any) {
    logError('Instructor registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

//Login (both students and instructors)
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    logInfo(`User logged in: ${email}`);

    // Generate tokens
    const tokens = generateTokens({
      userId: (user._id as string).toString(),
      email: user.email,
      role: user.role,
    });

    // Create user response without password
   delete user.password;

    const response: IApiResponse<IAuthResponse> = {
      success: true,
      message: 'Login successful',
      data: {
        user: user as IUser,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };

    res.json(response);
  } catch (error: any) {
    logError('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const response = {
      success: true,
      message: 'Profile retrieved successfully',
      data: user,
    };

    res.json(response);
  } catch (error: any) {
    logError('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error.message,
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, bio, profilePicture } = req.body;

    const updateData: Partial<IUser> = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logInfo(`Profile updated for user: ${user.email}`);

    const response: IApiResponse<IUser> = {
      success: true,
      message: 'Profile updated successfully',
      data: user,
    };

    res.json(response);
  } catch (error: any) {
    logError('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

/**
 * Change password
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    logInfo(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error: any) {
    logError('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
};

/**
 * Logout
 */
export const logout = async (req: Request, res: Response) => {
  try {
    logInfo(`User logged out: ${req.user?.email}`);

    //Store in redis to blacklist token

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    logError('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message,
    });
  }
};
