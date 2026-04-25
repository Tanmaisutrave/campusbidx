const User = require('../models/User');
const Transaction = require('../models/Transaction');

// GET /api/wallet
const getWallet = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance');
    res.json({ balance: user.walletBalance });
  } catch (err) {
    next(err);
  }
};

// POST /api/wallet/add
const addFunds = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const funds = Number(amount);

    if (!funds || funds <= 0) {
      return res.status(400).json({ message: 'Enter a valid amount' });
    }
    if (funds > 50000) {
      return res.status(400).json({ message: 'Maximum top-up is ₹50,000 at a time' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { walletBalance: funds } },
      { new: true }
    );

    await Transaction.create({
      user: req.user._id,
      amount: funds,
      type: 'credit',
      description: 'Wallet top-up',
    });

    res.json({ message: 'Funds added successfully', balance: user.walletBalance });
  } catch (err) {
    next(err);
  }
};

// GET /api/wallet/transactions
const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

module.exports = { getWallet, addFunds, getTransactions };
