const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const ownerMiddleware = require('../middleware/ownerMiddleware');
const validate = require('../middleware/validationMiddleware');
const { getOwnStore, getStoreRaters } = require('../controllers/ownerController');
const { ownerRatingsQuerySchema } = require('../utils/validators');

const router = express.Router();

router.use(authMiddleware);
router.use(ownerMiddleware);

router.get('/store', getOwnStore);
router.get(
  '/ratings',
  validate(ownerRatingsQuerySchema, 'query'),
  getStoreRaters
);

module.exports = router;
