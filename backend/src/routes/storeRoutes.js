const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { getStores, submitRating } = require('../controllers/storeController');
const {
  storesListQuerySchema,
  submitRatingSchema,
} = require('../utils/validators');

const router = express.Router();

router.use(authMiddleware);

router.get('/stores', validate(storesListQuerySchema, 'query'), getStores);
router.post('/ratings', validate(submitRatingSchema), submitRating);

module.exports = router;
