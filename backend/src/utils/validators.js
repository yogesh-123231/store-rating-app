const { z } = require('zod');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(
    /[!@#$%^&*]/,
    'Password must contain at least one special character (!@#$%^&*)'
  );

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must be at most 60 characters'),
  email: z.string().trim().email('Invalid email format'),
  password: passwordSchema,
  address: z
    .string()
    .trim()
    .max(400, 'Address must be at most 400 characters'),
});

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: passwordSchema,
});

const adminCreateUserSchema = registerSchema.extend({
  role: z.enum(['ADMIN', 'USER', 'OWNER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, USER, or OWNER' }),
  }),
});

const submitRatingSchema = z.object({
  storeId: z.coerce
    .number()
    .int('Store ID must be an integer')
    .positive('Store ID must be a positive integer'),
  rating: z.coerce
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be between 1 and 5')
    .max(5, 'Rating must be between 1 and 5'),
});

const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

const sortQuerySchema = z.object({
  sortBy: z.enum(['name', 'email', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

const adminUsersQuerySchema = paginationQuerySchema.merge(sortQuerySchema).extend({
  search: z.string().trim().optional(),
  role: z.enum(['ADMIN', 'USER', 'OWNER']).optional(),
});

const adminStoresQuerySchema = paginationQuerySchema.merge(sortQuerySchema).extend({
  search: z.string().trim().optional(),
});

const storesListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
});

const ownerRatingsQuerySchema = paginationQuerySchema;

const userIdParamsSchema = z.object({
  id: z.coerce
    .number()
    .int('User ID must be an integer')
    .positive('Invalid user ID'),
});

const adminCreateStoreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Store name is required')
    .max(100, 'Store name must be at most 100 characters'),
  email: z.string().trim().email('Invalid email format'),
  address: z
    .string()
    .trim()
    .max(400, 'Address must be at most 400 characters'),
  ownerId: z.coerce
    .number()
    .int('Owner ID must be an integer')
    .positive('Owner ID must be a positive number'),
});

function formatZodErrors(error) {
  const details = {};
  error.errors.forEach((err) => {
    const field = err.path.join('.') || 'body';
    details[field] = err.message;
  });
  return details;
}

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  adminCreateUserSchema,
  adminCreateStoreSchema,
  submitRatingSchema,
  paginationQuerySchema,
  adminUsersQuerySchema,
  adminStoresQuerySchema,
  storesListQuerySchema,
  ownerRatingsQuerySchema,
  userIdParamsSchema,
  formatZodErrors,
};
