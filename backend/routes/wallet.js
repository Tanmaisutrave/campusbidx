const express = require('express');
const { body } = require('express-validator');
const { getWallet, addFunds, getTransactions } = require('../controllers/walletController');
const protect = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.get('/', getWallet);
router.get('/transactions', getTransactions);

router.post(
  '/add',
  [body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0')],
  validate,
  addFunds
);

module.exports = router;
