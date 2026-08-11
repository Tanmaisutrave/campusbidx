import { useState, useEffect } from 'react';
import AuctionCard from '../components/AuctionCard';
import { auctionService } from '../services/api';
import DEMO_AUCTIONS from '../data/demoAuctions';

import heroImg from '../assets/hero.png';

const CATEGORIES = ['All', 'Books', 'Gadgets', 'Accessories', 'Clothing', 'Other'];

const Home = () => {
  // realAuctions: data fetched from the backend (active auctions from MongoDB)
  const [realAuctions, setRealAuctions] = useState([]);
  // apiLoaded: true once the first fetch attempt (success or fail) completes
  const [apiLoaded, setApiLoaded] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await auctionService.getAll();
        // Only store real auctions — demo data is injected separately below
        setRealAuctions(Array.isArray(res.data) ? res.data : []);
      } catch {
        // API unreachable: treat as zero real auctions so demo fallback activates
        setRealAuctions([]);
      } finally {
        setApiLoaded(true);
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  useEffect(() => {
    if (!apiLoaded) return;

    /**
     * Demo fallback logic:
     *   CASE A — real auctions exist  → display only real auctions (search/filter apply)
     *   CASE B — zero real auctions   → display demo auctions    (search/filter apply)
     *   CASE C — filters return 0 on real auctions → show normal "no results" state
     *
     * The demo pool is used ONLY when there are zero real auctions overall.
     * It is never mixed with real auction results.
     */
    const usingDemo = realAuctions.length === 0;
    const pool = usingDemo ? DEMO_AUCTIONS : realAuctions;

    let result = pool;
    if (category !== 'All') result = result.filter((a) => a.category === category);
    if (search) result = result.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [realAuctions, apiLoaded, category, search]);

  // Whether we're currently in demo mode (no real auctions from backend)
  const isDemoMode = apiLoaded && realAuctions.length === 0;

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

      {/* Section heading — changes based on demo vs real mode */}
      {!loading && (
        isDemoMode ? (
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Featured Auctions</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Explore popular items from the campus marketplace.
              {/* Subtle note so viewers know these are sample items */}
              <span className="ml-2 text-xs text-orange-500 font-medium">(Sample listings — real auctions will appear here once posted)</span>
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm mb-4">
            {filtered.length} auction{filtered.length !== 1 ? 's' : ''} found
          </p>
        )
      )}

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
