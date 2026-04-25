const Auction = require('../models/Auction');
const Bid = require('../models/Bid');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

/**
 * Finalizes an expired auction:
 * - Finds highest bid
 * - Sets winner, deducts from winner wallet, credits seller
 * - Refunds all non-winning bidders
 * - Marks auction as completed
 */
const finalizeAuction = async (auction, io) => {
  if (auction.status !== 'active') return;
  if (new Date() < new Date(auction.endTime)) return;

  const bids = await Bid.find({ auction: auction._id }).sort({ bidAmount: -1 });

  if (bids.length === 0) {
    auction.status = 'completed';
    await auction.save();
    return;
  }

  const winningBid = bids[0];
  const winner = await User.findById(winningBid.bidder);
  const seller = await User.findById(auction.seller);

  // Deduct from winner (already held from bid placement)
  // Credit seller
  seller.walletBalance += winningBid.bidAmount;
  await seller.save();

  await Transaction.create({
    user: seller._id,
    amount: winningBid.bidAmount,
    type: 'credit',
    description: `Auction sold: "${auction.title}"`,
  });

  // Refund all non-winning bidders (unique, highest bid per bidder)
  const bidderMap = {};
  for (const bid of bids) {
    const key = bid.bidder.toString();
    if (!bidderMap[key]) bidderMap[key] = bid; // already sorted desc, first = highest
  }

  for (const [bidderId, bid] of Object.entries(bidderMap)) {
    if (bidderId === winningBid.bidder.toString()) continue; // winner keeps their deduction
    await User.findByIdAndUpdate(bidderId, { $inc: { walletBalance: bid.bidAmount } });
    await Transaction.create({
      user: bidderId,
      amount: bid.bidAmount,
      type: 'credit',
      description: `Refund - Auction ended: "${auction.title}"`,
    });
  }

  auction.status = 'completed';
  auction.winner = winner._id;
  await auction.save();

  // Emit socket event if io is available
  if (io) {
    io.to(auction._id.toString()).emit('auctionEnded', {
      auctionId: auction._id,
      winner: { id: winner._id, name: winner.name },
      winningBid: winningBid.bidAmount,
    });
  }

  console.log(`🏁 Auction "${auction.title}" finalized. Winner: ${winner.name}`);
};

/**
 * Runs every minute to check and finalize expired auctions
 */
const startScheduler = (io) => {
  setInterval(async () => {
    try {
      const expiredAuctions = await Auction.find({
        status: 'active',
        endTime: { $lte: new Date() },
      });
      for (const auction of expiredAuctions) {
        await finalizeAuction(auction, io);
      }
    } catch (err) {
      console.error('Scheduler error:', err.message);
    }
  }, 60 * 1000); // every 60 seconds

  console.log('⏰ Auction scheduler started');
};

module.exports = { startScheduler, finalizeAuction };
