import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auctionService } from '../services/api';

const BidForm = ({ auction, onBidPlaced }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const minBid = (auction.currentBid || auction.startingPrice) + 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!amount || Number(amount) < minBid) {
      setError(`Bid must be at least ₹${minBid}`);
      return;
    }
    setLoading(true);
    try {
      await auctionService.placeBid(auction._id, Number(amount));
      setSuccess('Bid placed successfully!');
      setAmount('');
      onBidPlaced?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-center text-primary-700 text-sm">
        Please <a href="/login" className="font-semibold underline">login</a> to place a bid.
      </div>
    );
  }

  if (auction.status !== 'active') {
    return (
      <div className="bg-gray-100 rounded-xl p-4 text-center text-gray-500 text-sm">
        This auction is not active.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Bid (min ₹{minBid})
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={minBid}
              placeholder={minBid}
              className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Placing...' : 'Place Bid'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
    </form>
  );
};

export default BidForm;
