import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎓</span>
              <span className="text-white font-bold text-xl">CampusBid</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              A secure, campus-focused auction platform for students to buy and sell unused items.
            </p>
            <div className="flex gap-3 mt-4">
              {['📘', '🐦', '📸', '💼'].map((icon, i) => (
                <button key={i} className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center text-sm transition-colors">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/create-auction', label: 'Create Auction' },
                { to: '/my-auctions', label: 'My Auctions' },
                { to: '/wallet', label: 'Wallet' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Categories</h4>
            <ul className="space-y-2 text-sm">
              {['Books', 'Gadgets', 'Accessories', 'Clothing', 'Other'].map((cat) => (
                <li key={cat}>
                  <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span>📧</span>
                <span>support@campusbid.edu</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Campus Student Center, Block A</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🕐</span>
                <span>Mon – Fri, 9am – 5pm</span>
              </li>
            </ul>
            <div className="mt-4 bg-gray-800 rounded-lg px-3 py-2 text-xs text-gray-400">
              🔒 All transactions are secured and verified
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} CampusBid. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Use</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Help Center</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
