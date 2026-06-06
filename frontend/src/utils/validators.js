import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)');

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must be at most 60 characters'),
  email: z.string().trim().email('Invalid email format'),
  password: passwordSchema,
  address: z.string().trim().max(400, 'Address must be at most 400 characters'),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const submitRatingSchema = z.object({
  storeId: z.number().int().positive('Store ID must be a positive integer'),
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
});

export const adminCreateUserSchema = registerSchema.extend({
  role: z.enum(['ADMIN', 'USER', 'OWNER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, USER, or OWNER' }),
  }),
});

export const adminCreateStoreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Store name is required')
    .max(100, 'Store name must be at most 100 characters'),
  email: z.string().trim().email('Invalid email format'),
  address: z.string().trim().max(400, 'Address must be at most 400 characters'),
  ownerId: z.coerce
    .number({ invalid_type_error: 'Please select a store owner' })
    .int('Owner ID must be an integer')
    .positive('Please select a store owner'),
});
