const express = require('express');
const {
  register,
  login,
  changePassword,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { authRateLimiter } = require('../middleware/rateLimitMiddleware');
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require('../utils/validators');

const router = express.Router();

router.use(authRateLimiter);

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.put(
  '/change-password',
  authMiddleware,
  validate(changePasswordSchema),
  changePassword
);

module.exports = router;
