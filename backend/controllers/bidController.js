const Bid = require('../models/Bid');
const Auction = require('../models/Auction');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// POST /api/bids/place
const placeBid = async (req, res, next) => {
  try {
    const { auctionId, amount } = req.body;
    const bidAmount = Number(amount);

    const auction = await Auction.findById(auctionId);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.status !== 'active') return res.status(400).json({ message: 'Auction is not active' });
    if (new Date() > new Date(auction.endTime)) return res.status(400).json({ message: 'Auction has ended' });
    if (auction.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own auction' });
    }

    const minBid = (auction.currentBid || auction.startingPrice) + 1;
    if (bidAmount < minBid) {
      return res.status(400).json({ message: `Bid must be at least ₹${minBid}` });
    }

    const bidder = await User.findById(req.user._id);
    if (bidder.walletBalance < bidAmount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Refund previous highest bidder
    if (auction.currentBid) {
      const prevHighestBid = await Bid.findOne({ auction: auction._id })
        .sort({ bidAmount: -1 });

      if (prevHighestBid && prevHighestBid.bidder.toString() !== req.user._id.toString()) {
        await User.findByIdAndUpdate(prevHighestBid.bidder, {
          $inc: { walletBalance: prevHighestBid.bidAmount },
        });
        await Transaction.create({
          user: prevHighestBid.bidder,
          amount: prevHighestBid.bidAmount,
          type: 'credit',
          description: `Refund - Outbid on "${auction.title}"`,
        });
      }
    }

    // Deduct from bidder wallet
    bidder.walletBalance -= bidAmount;
    await bidder.save();

    await Transaction.create({
      user: req.user._id,
      amount: bidAmount,
      type: 'debit',
      description: `Bid placed on "${auction.title}"`,
    });

    // Save bid
    const bid = await Bid.create({
      bidder: req.user._id,
      auction: auction._id,
      bidAmount,
    });

    // Update auction currentBid
    auction.currentBid = bidAmount;
    await auction.save();

    // Emit real-time update via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(auction._id.toString()).emit('newBid', {
        auctionId: auction._id,
        currentBid: bidAmount,
        bidder: req.user.name,
        bidTime: bid.bidTime,
      });
    }

    res.status(201).json({
      message: 'Bid placed successfully',
      currentBid: auction.currentBid,
      walletBalance: bidder.walletBalance,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/bids/:auctionId — bid history for an auction
const getBidHistory = async (req, res, next) => {
  try {
    const bids = await Bid.find({ auction: req.params.auctionId })
      .populate('bidder', 'name studentId')
      .sort({ bidAmount: -1 });

    res.json(bids);
  } catch (err) {
    next(err);
  }
};

module.exports = { placeBid, getBidHistory };
