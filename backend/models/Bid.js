const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
    bidAmount: { type: Number, required: true },
    bidTime: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bid', bidSchema);
