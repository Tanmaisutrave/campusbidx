const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Books', 'Gadgets', 'Accessories', 'Clothing', 'Other'],
      required: true,
    },
    startingPrice: { type: Number, required: true, min: 1 },
    currentBid: { type: Number, default: null },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected', 'completed'],
      default: 'pending',
    },
    duration: { type: Number, default: 3 }, // days
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Auction', auctionSchema);
