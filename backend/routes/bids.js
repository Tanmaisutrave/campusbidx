const express = require('express');
const { body } = require('express-validator');
const { placeBid, getBidHistory } = require('../controllers/bidController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/place',
  protect,
  [
    body('auctionId').notEmpty().withMessage('Auction ID is required'),
    body('amount').isFloat({ min: 1 }).withMessage('Bid amount must be at least 1'),
  ],
  validate,
  placeBid
);

router.get('/:auctionId', getBidHistory);

module.exports = router;
