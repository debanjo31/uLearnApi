import mongoose, { Document } from 'mongoose';
import type { Request } from 'express';

// User Interface
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'instructor' | 'admin';
  bio?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Course Interface
export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  instructorId: mongoose.Types.ObjectId;
  status: 'draft' | 'published' | 'unpublished';
  duration?: number; // in hours
  rating: number;
  enrollmentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Section Interface
export interface ISection extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  learningObjective?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Module Interface
export interface IModule extends Document {
  sectionId: mongoose.Types.ObjectId;
  title: string;
  type: 'video' | 'video_slide' | 'article' | 'quiz' | 'assignment';
  content: string; // URL for video/PDF or text content
  order: number;
  duration?: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
}

// Enrollment Interface
export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  enrollmentDate: Date;
  progress: number; // percentage completed
  paymentStatus: 'pending' | 'paid' | 'free';
  certificateUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review Interface
export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

// QA Interface
export interface IQA extends Document {
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // questioner
  question: string;
  answer?: string;
  answererId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Payment Interface
export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  transactionId: string;
  amount: number;
  refundStatus: 'none' | 'requested' | 'processed';
  payoutDate?: Date;
  status: 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

// Notification Interface
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'announcement' | 'update' | 'reply';
  content: string;
  status: 'sent' | 'read';
  createdAt: Date;
  updatedAt: Date;
}

// Resource Interface
export interface IResource extends Document {
  sectionId?: mongoose.Types.ObjectId;
  moduleId?: mongoose.Types.ObjectId;
  url: string;
  type: 'pdf' | 'link' | 'code' | 'slide';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Additional utility interfaces for API responses
export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: Record<string, any>;
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Authentication interfaces
export interface ILoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'student' | 'instructor';
}

export interface IAuthResponse {
  user: Partial<IUser>;
  token: string;
  refreshToken?: string;
}

// Course creation interfaces
export interface ICourseCreateRequest {
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
}

export interface ISectionCreateRequest {
  courseId: string;
  title: string;
  description?: string;
  learningObjective?: string;
  order: number;
}

export interface IModuleCreateRequest {
  sectionId: string;
  title: string;
  type: 'video' | 'video_slide' | 'article' | 'quiz' | 'assignment';
  content: string;
  order: number;
  duration?: number;
}

// Enrollment interfaces
export interface IEnrollmentRequest {
  courseId: string;
  paymentMethod?: string;
}

// Review interfaces
export interface IReviewCreateRequest {
  courseId: string;
  rating: number;
  comment?: string;
}

// QA interfaces
export interface IQuestionCreateRequest {
  courseId: string;
  question: string;
}

export interface IAnswerCreateRequest {
  questionId: string;
  answer: string;
}

// Payment interfaces
export interface IPaymentCreateRequest {
  courseId: string;
  amount: number;
  paymentMethodId: string;
}

// Error interfaces
export interface IApiError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Database connection interface
export interface IDbConfig {
  uri: string;
  options?: mongoose.ConnectOptions;
}

// JWT payload interface
export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Extended Request interface for authenticated routes
export interface AuthRequest extends Omit<Request, 'user'> {
  user?: {
    id: string;
    email: string;
    role: 'student' | 'instructor' | 'admin';
  };
}
