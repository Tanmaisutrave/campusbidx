const Auction = require('../models/Auction');
const User = require('../models/User');
const Bid = require('../models/Bid');

// GET /api/admin/pending-auctions
const getPendingAuctions = async (req, res, next) => {
  try {
    const auctions = await Auction.find({ status: 'pending' })
      .populate('seller', 'name studentId email')
      .sort({ createdAt: -1 });
    res.json(auctions);
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/approve/:id
const approveAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.status !== 'pending') {
      return res.status(400).json({ message: `Auction is already ${auction.status}` });
    }

    const startTime = new Date();
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + auction.duration);

    auction.status = 'active';
    auction.startTime = startTime;
    auction.endTime = endTime;
    await auction.save();

    res.json({ message: 'Auction approved and is now live', auction });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/reject/:id
const rejectAuction = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.status !== 'pending') {
      return res.status(400).json({ message: `Auction is already ${auction.status}` });
    }

    auction.status = 'rejected';
    await auction.save();

    res.json({ message: 'Auction rejected', auction });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/auctions — all auctions regardless of status
const getAllAuctions = async (req, res, next) => {
  try {
    const auctions = await Auction.find()
      .populate('seller', 'name studentId')
      .populate('winner', 'name')
      .sort({ createdAt: -1 });
    res.json(auctions);
  } catch (err) {
    next(err);
  }
};

module.exports = { getPendingAuctions, approveAuction, rejectAuction, getAllUsers, getAllAuctions };
