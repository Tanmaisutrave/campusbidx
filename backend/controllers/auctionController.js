const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// POST /api/auctions/create
const createAuction = async (req, res, next) => {
  try {
    const { title, description, category, startingPrice, duration, image } = req.body;

    const auction = await Auction.create({
      title,
      description,
      category,
      startingPrice: Number(startingPrice),
      duration: Number(duration) || 3,
      image: image || '',
      seller: req.user._id,
      status: 'pending',
    });

    res.status(201).json({ message: 'Auction submitted for approval', auction });
  } catch (err) {
    next(err);
  }
};

// GET /api/auctions — all active auctions
const getAllAuctions = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { status: 'active' };
    if (category && category !== 'All') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const auctions = await Auction.find(filter)
      .populate('seller', 'name studentId')
      .sort({ createdAt: -1 });

    res.json(auctions);
  } catch (err) {
    next(err);
  }
};

// GET /api/auctions/:id — single auction with bid history
const getAuctionById = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id).populate('seller', 'name studentId');
    if (!auction) return res.status(404).json({ message: 'Auction not found' });

    const bids = await Bid.find({ auction: auction._id })
      .populate('bidder', 'name')
      .sort({ bidAmount: -1 });

    const auctionObj = auction.toObject();
    auctionObj.bids = bids.map((b) => ({
      _id: b._id,
      bidder: b.bidder?.name || 'Unknown',
      amount: b.bidAmount,
      time: b.bidTime,
    }));

    res.json(auctionObj);
  } catch (err) {
    next(err);
  }
};

// GET /api/auctions/my — auctions created by logged-in user
const getMyAuctions = async (req, res, next) => {
  try {
    const auctions = await Auction.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json(auctions);
  } catch (err) {
    next(err);
  }
};

// GET /api/auctions/my-bids — auctions the user has bid on
const getMyBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ bidder: req.user._id })
      .populate({
        path: 'auction',
        populate: { path: 'seller', select: 'name' },
      })
      .sort({ bidTime: -1 });

    // Deduplicate by auction, keep highest bid per auction
    const auctionMap = {};
    for (const bid of bids) {
      if (!bid.auction) continue;
      const aId = bid.auction._id.toString();
      if (!auctionMap[aId] || bid.bidAmount > auctionMap[aId].myBid) {
        auctionMap[aId] = { ...bid.auction.toObject(), myBid: bid.bidAmount };
      }
    }

    res.json(Object.values(auctionMap));
  } catch (err) {
    next(err);
  }
};

module.exports = { createAuction, getAllAuctions, getAuctionById, getMyAuctions, getMyBids };
