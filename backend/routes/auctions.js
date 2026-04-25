const express = require('express');
const { body } = require('express-validator');
const {
  createAuction,
  getAllAuctions,
  getAuctionById,
  getMyAuctions,
  getMyBids,
} = require('../controllers/auctionController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Public
router.get('/', getAllAuctions);

// Protected — order matters: specific paths before :id
router.get('/my', protect, getMyAuctions);
router.get('/my-bids', protect, getMyBids);
router.get('/:id', getAuctionById);

router.post(
  '/create',
  protect,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category')
      .isIn(['Books', 'Gadgets', 'Accessories', 'Clothing', 'Other'])
      .withMessage('Invalid category'),
    body('startingPrice').isFloat({ min: 1 }).withMessage('Starting price must be at least 1'),
    body('duration').isInt({ min: 1, max: 30 }).withMessage('Duration must be between 1 and 30 days'),
  ],
  validate,
  createAuction
);

module.exports = router;
