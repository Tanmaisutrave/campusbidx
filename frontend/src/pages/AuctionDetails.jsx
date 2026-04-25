import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auctionService } from '../services/api';
import BidForm from '../components/BidForm';
import CountdownTimer from '../components/CountdownTimer';

import mathsImg from '../assets/Maths.jfif';

const MOCK = {
  _id: '1',
  title: 'Engineering Mathematics Textbook',
  description: 'Slightly used Engineering Mathematics textbook by H.K. Dass. All pages intact, minimal highlighting. Perfect for first-year students.',
  startingPrice: 200,
  currentBid: 350,
  endTime: new Date(Date.now() + 86400000 * 2).toISOString(),
  category: 'Books',
  status: 'active',
  image: mathsImg,
  seller: { name: 'Rahul Sharma', studentId: 'CS2021001' },
  bids: [
    { bidder: 'Priya M.', amount: 350, time: new Date(Date.now() - 3600000).toISOString() },
    { bidder: 'Arjun K.', amount: 280, time: new Date(Date.now() - 7200000).toISOString() },
    { bidder: 'Sneha R.', amount: 230, time: new Date(Date.now() - 10800000).toISOString() },
  ],
};

const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAuction = async () => {
    try {
      const res = await auctionService.getById(id);
      setAuction(res.data);
    } catch {
      setAuction(MOCK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAuction(); }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-5xl">😕</p>
        <p className="mt-4 text-lg">Auction not found</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary-600 underline">Go back</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary-600 hover:text-primary-800 mb-6 text-sm font-medium">
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image + Details */}
        <div>
          <div className="rounded-2xl overflow-hidden shadow-md mb-4">
            <img src={auction.image || 'https://placehold.co/600x400/ea580c/ffffff?text=No+Image'} alt={auction.title} className="w-full object-cover max-h-96" onError={(e) => { e.target.src = 'https://placehold.co/600x400/ea580c/ffffff?text=No+Image'; }} />
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-800">{auction.title}</h1>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${auction.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {auction.status}
              </span>
            </div>
            {auction.category && (
              <span className="inline-block bg-primary-100 text-primary-700 text-xs px-3 py-1 rounded-full mb-3">{auction.category}</span>
            )}
            <p className="text-gray-600 leading-relaxed mb-4">{auction.description}</p>
            <div className="border-t pt-4 text-sm text-gray-500">
              <p>Seller: <span className="font-medium text-gray-700">{auction.seller?.name}</span></p>
              {auction.seller?.studentId && <p>Student ID: <span className="font-medium text-gray-700">{auction.seller.studentId}</span></p>}
            </div>
          </div>
        </div>

        {/* Right: Bid info */}
        <div className="space-y-4">
          {/* Price card */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">Starting Price</p>
                <p className="text-lg font-medium text-gray-700">₹{auction.startingPrice}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Highest Bid</p>
                <p className="text-3xl font-bold text-primary-600">₹{auction.currentBid || auction.startingPrice}</p>
              </div>
            </div>
            <div className="bg-primary-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-500 mb-2">Auction ends in</p>
              <CountdownTimer endTime={auction.endTime} />
            </div>
            <BidForm auction={auction} onBidPlaced={fetchAuction} />
          </div>

          {/* Bid history */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Bid History ({auction.bids?.length || 0})</h3>
            {auction.bids?.length > 0 ? (
              <div className="space-y-3">
                {auction.bids.map((bid, i) => (
                  <div key={i} className={`flex justify-between items-center py-2 px-3 rounded-lg ${i === 0 ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'}`}>
                    <div>
                      <p className="font-medium text-sm text-gray-800">{bid.bidder}</p>
                      <p className="text-xs text-gray-400">{new Date(bid.time).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${i === 0 ? 'text-primary-600' : 'text-gray-600'}`}>₹{bid.amount}</p>
                      {i === 0 && <p className="text-xs text-green-600">Highest</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">No bids yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
