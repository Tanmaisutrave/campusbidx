import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionService } from '../services/api';

const MOCK_CREATED = [
  { _id: '1', title: 'Engineering Mathematics Textbook', startingPrice: 200, currentBid: 350, status: 'active', endTime: new Date(Date.now() + 86400000 * 2).toISOString(), category: 'Books' },
  { _id: '3', title: 'Scientific Calculator', startingPrice: 300, currentBid: 300, status: 'pending', endTime: new Date(Date.now() + 86400000 * 3).toISOString(), category: 'Gadgets' },
];
const MOCK_BIDS = [
  { _id: '2', title: 'Wireless Earbuds', startingPrice: 800, currentBid: 1200, myBid: 1100, status: 'active', endTime: new Date(Date.now() + 86400000).toISOString(), category: 'Gadgets' },
  { _id: '4', title: 'Leather Backpack', startingPrice: 500, currentBid: 750, myBid: 750, status: 'active', endTime: new Date(Date.now() + 86400000 * 1.5).toISOString(), category: 'Accessories' },
];

const statusBadge = (status) => {
  const map = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    ended: 'bg-red-100 text-red-700',
    rejected: 'bg-gray-100 text-gray-500',
    approved: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${map[status] || 'bg-gray-100 text-gray-500'}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  );
};

const AuctionRow = ({ auction, showMyBid = false, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
  >
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <p className="font-medium text-gray-800 truncate">{auction.title}</p>
        {statusBadge(auction.status)}
      </div>
      <p className="text-xs text-gray-400">{auction.category} • Ends {new Date(auction.endTime).toLocaleDateString()}</p>
    </div>
    <div className="text-right ml-4 shrink-0">
      <p className="text-xs text-gray-400">Current Bid</p>
      <p className="font-bold text-primary-600">₹{auction.currentBid || auction.startingPrice}</p>
      {showMyBid && auction.myBid && (
        <p className={`text-xs mt-0.5 ${auction.myBid === auction.currentBid ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
          {auction.myBid === auction.currentBid ? '🏆 Winning' : `Your bid: ₹${auction.myBid}`}
        </p>
      )}
    </div>
  </div>
);

const MyAuctions = () => {
  const navigate = useNavigate();
  const [created, setCreated] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('created');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [c, b] = await Promise.all([auctionService.getMyAuctions(), auctionService.getMyBids()]);
        setCreated(c.data);
        setBids(b.data);
      } catch {
        setCreated(MOCK_CREATED);
        setBids(MOCK_BIDS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const tabs = [
    { key: 'created', label: `My Listings (${created.length})` },
    { key: 'bids', label: `My Bids (${bids.length})` },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Auctions</h1>
          <p className="text-gray-500 text-sm mt-1">Track your listings and bids</p>
        </div>
        <button
          onClick={() => navigate('/create-auction')}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          + New Auction
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Listings', value: created.length, icon: '📦' },
          { label: 'Active', value: created.filter(a => a.status === 'active').length, icon: '🟢' },
          { label: 'Pending', value: created.filter(a => a.status === 'pending').length, icon: '⏳' },
          { label: 'Bids Placed', value: bids.length, icon: '🏷️' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl">{s.icon}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {(tab === 'created' ? created : bids).length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl">{tab === 'created' ? '📦' : '🏷️'}</p>
              <p className="mt-3">{tab === 'created' ? 'No listings yet' : 'No bids placed yet'}</p>
            </div>
          ) : (
            (tab === 'created' ? created : bids).map((a) => (
              <AuctionRow
                key={a._id}
                auction={a}
                showMyBid={tab === 'bids'}
                onClick={() => navigate(`/auction/${a._id}`)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyAuctions;
