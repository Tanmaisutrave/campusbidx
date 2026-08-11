const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const generateToken = require('../utils/generateToken');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, studentId } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

    const existingId = await User.findOne({ studentId });
    if (existingId) return res.status(400).json({ message: 'Student ID already registered' });

    const user = await User.create({ name, email, password, studentId });

    // Initial wallet credit
    await Transaction.create({
      user: user._id,
      amount: 5000,
      type: 'credit',
      description: 'Welcome bonus - Initial wallet credit',
    });

    const token = generateToken(user._id);
    res.status(201).json({ token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) return res.status(401).json({ message: 'No account found with this email' });

    if (!user.password) return res.status(401).json({ message: 'Password not set for this account' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = generateToken(user._id);
    res.json({ token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};

// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword, avatar, bio } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password is required' });
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
      user.password = newPassword;
    }

    await user.save();
    res.json({ user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

const sanitize = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  studentId: user.studentId,
  role: user.role,
  walletBalance: user.walletBalance,
  avatar: user.avatar,
  bio: user.bio,
  createdAt: user.createdAt,
});

// GET /api/auth/profile/stats
const getProfileStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [auctionsCreated, auctionsWon, activeBids, transactions] = await Promise.all([
      Auction.countDocuments({ seller: userId }),
      Auction.countDocuments({ winner: userId }),
      Bid.countDocuments({ bidder: userId }),
      Transaction.find({ user: userId }).sort({ date: -1 }).limit(10),
    ]);

    const totalSpent = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalEarned = transactions
      .filter(t => t.type === 'credit' && !t.description.includes('Welcome'))
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({ auctionsCreated, auctionsWon, activeBids, totalTransactions: transactions.length, totalSpent, totalEarned, recentActivity: transactions });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateProfile, getProfileStats };
