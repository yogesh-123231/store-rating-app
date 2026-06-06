const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validationMiddleware');
const {
  createUser,
  createStore,
  getDashboard,
  getAllUsers,
  getUserById,
  getAllStores,
} = require('../controllers/adminController');
const {
  adminCreateUserSchema,
  adminCreateStoreSchema,
  adminUsersQuerySchema,
  adminStoresQuerySchema,
  userIdParamsSchema,
} = require('../utils/validators');

const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post('/users', validate(adminCreateUserSchema), createUser);
router.post('/stores', validate(adminCreateStoreSchema), createStore);
router.get('/dashboard', getDashboard);
router.get('/users', validate(adminUsersQuerySchema, 'query'), getAllUsers);
router.get(
  '/users/:id',
  validate(userIdParamsSchema, 'params'),
  getUserById
);
router.get('/stores', validate(adminStoresQuerySchema, 'query'), getAllStores);

module.exports = router;
