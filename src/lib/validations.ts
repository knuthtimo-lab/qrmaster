import { z } from 'zod';

// QR Code validation schemas
export const qrCodeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  contentType: z.enum(['URL', 'PHONE', 'EMAIL', 'SMS', 'TEXT', 'WIFI', 'WHATSAPP']),
  content: z.record(z.any()).refine((data) => {
    // Validate content based on contentType
    const contentType = data.contentType;
    if (contentType === 'URL' && !data.url) return false;
    if (contentType === 'PHONE' && !data.phone) return false;
    if (contentType === 'EMAIL' && !data.email) return false;
    if (contentType === 'SMS' && !data.phone) return false;
    if (contentType === 'TEXT' && !data.text) return false;
    if (contentType === 'WIFI' && !data.ssid) return false;
    if (contentType === 'WHATSAPP' && !data.phone) return false;
    return true;
  }, 'Content is required for this type'),
  isStatic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  style: z.object({
    foregroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
    cornerStyle: z.enum(['square', 'rounded', 'dot']),
    size: z.number().min(100).max(1000),
  }).optional(),
});

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  company: z.string().optional(),
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Profile update schema
export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
});

// Team invitation schema
export const teamInviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
});

// Bulk upload schema
export const bulkUploadSchema = z.object({
  data: z.array(z.object({
    title: z.string().min(1, 'Title is required'),
    contentType: z.enum(['URL', 'PHONE', 'EMAIL', 'SMS', 'TEXT', 'WIFI', 'WHATSAPP']),
    content: z.string().min(1, 'Content is required'),
    tags: z.string().optional(),
  })),
});

// Analytics filter schema
export const analyticsFilterSchema = z.object({
  timeRange: z.enum(['1', '7', '30', '90', '365']),
  qrCodeId: z.string().optional(),
  device: z.enum(['all', 'mobile', 'desktop', 'tablet']).optional(),
  country: z.string().optional(),
});

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

// Error message helper
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof z.ZodError) {
    return error.errors.map(e => e.message).join(', ');
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};
