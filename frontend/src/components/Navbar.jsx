import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        location.pathname === to
          ? 'bg-primary-700 text-white'
          : 'text-primary-100 hover:bg-primary-700 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-primary-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-white font-bold text-lg tracking-tight">CampusBidX</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLink('/', 'Home')}
            {user && navLink('/create-auction', 'Create Auction')}
            {user && navLink('/my-auctions', 'My Auctions')}
            {user && navLink('/wallet', 'Wallet')}
            {user && navLink('/profile', 'Profile')}
            {isAdmin && navLink('/admin', 'Admin Dashboard')}
            {user ? (
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-2 rounded-md text-sm font-medium text-primary-100 hover:bg-primary-700 hover:text-white transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                {navLink('/login', 'Login')}
                {navLink('/signup', 'Sign Up')}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 flex flex-col gap-1">
            {navLink('/', 'Home')}
            {user && navLink('/create-auction', 'Create Auction')}
            {user && navLink('/my-auctions', 'My Auctions')}
            {user && navLink('/wallet', 'Wallet')}
            {user && navLink('/profile', 'Profile')}
            {isAdmin && navLink('/admin', 'Admin Dashboard')}
            {user ? (
              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 rounded-md text-sm font-medium text-primary-100 hover:bg-primary-700 hover:text-white"
              >
                Logout
              </button>
            ) : (
              <>
                {navLink('/login', 'Login')}
                {navLink('/signup', 'Sign Up')}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
