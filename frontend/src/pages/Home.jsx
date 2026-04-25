import { useState, useEffect } from 'react';
import AuctionCard from '../components/AuctionCard';
import { auctionService } from '../services/api';

import mathsImg from '../assets/Maths.jfif';
import earbudImg from '../assets/earbud.webp';
import calcImg from '../assets/calculater_files/7187PNsuDxL.jpg';
import backpackImg from '../assets/backpack.webp';
import dsbookImg from '../assets/DS book.webp';
import usbhubImg from '../assets/USB hub.webp';
import heroImg from '../assets/hero.png';

const CATEGORIES = ['All', 'Books', 'Gadgets', 'Accessories', 'Clothing', 'Other'];

const MOCK_AUCTIONS = [
  { _id: '1', title: 'Engineering Mathematics Textbook', startingPrice: 200, currentBid: 350, endTime: new Date(Date.now() + 86400000 * 2).toISOString(), category: 'Books', status: 'active', image: mathsImg },
  { _id: '2', title: 'Wireless Earbuds (barely used)', startingPrice: 800, currentBid: 1200, endTime: new Date(Date.now() + 86400000).toISOString(), category: 'Gadgets', status: 'active', image: earbudImg },
  { _id: '3', title: 'Scientific Calculator', startingPrice: 300, currentBid: 300, endTime: new Date(Date.now() + 86400000 * 3).toISOString(), category: 'Gadgets', status: 'active', image: calcImg },
  { _id: '4', title: 'Leather Backpack', startingPrice: 500, currentBid: 750, endTime: new Date(Date.now() + 86400000 * 1.5).toISOString(), category: 'Accessories', status: 'active', image: backpackImg },
  { _id: '5', title: 'Data Structures Book', startingPrice: 150, currentBid: 220, endTime: new Date(Date.now() + 86400000 * 4).toISOString(), category: 'Books', status: 'active', image: dsbookImg },
  { _id: '6', title: 'USB-C Hub', startingPrice: 400, currentBid: 550, endTime: new Date(Date.now() + 3600000 * 5).toISOString(), category: 'Gadgets', status: 'active', image: usbhubImg },
];

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await auctionService.getAll();
        setAuctions(res.data);
      } catch {
        setAuctions(MOCK_AUCTIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  useEffect(() => {
    let result = auctions;
    if (category !== 'All') result = result.filter((a) => a.category === category);
    if (search) result = result.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [auctions, category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-primary-600 to-orange-700 rounded-2xl p-8 mb-8 text-white overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Campus Auction Marketplace</h1>
          <p className="text-primary-100 text-lg">Buy and sell unused items within your campus community</p>
          <div className="mt-4 flex gap-4 text-sm flex-wrap">
            <span className="bg-white/20 px-3 py-1 rounded-full">🔒 Secure Bidding</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">✅ Verified Students</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">⚡ Real-time Updates</span>
          </div>
        </div>
        <img
          src={heroImg}
          alt="Campus Auction"
          className="absolute right-0 top-0 h-full w-64 object-cover opacity-20 rounded-r-2xl"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search auctions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-primary-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-gray-500 text-sm mb-4">{filtered.length} auction{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-lg">No auctions found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((auction) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
