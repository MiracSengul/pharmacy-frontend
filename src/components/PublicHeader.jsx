import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './PublicHeader.css';

const PublicHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <header className="public-header">
      <div className="public-header-left">
        <div className="public-logo-icon">
            <img src="src//assets//logo.svg" alt="E-Pharmacy Logo" />
        </div>
        <span className="public-brand-text">E-Pharmacy</span>
      </div>

      <nav className="public-nav">
        <NavLink to="/home" className={({ isActive }) => `public-nav-item ${isActive ? 'active' : ''}`}>
          Home
        </NavLink>
        <NavLink to="/medicine" className={({ isActive }) => `public-nav-item ${isActive ? 'active' : ''}`}>
          Medicine
        </NavLink>
        <NavLink to="/medicine-store" className={({ isActive }) => `public-nav-item ${isActive ? 'active' : ''}`}>
          Medicine Store
        </NavLink>
      </nav>

      <div className="public-header-right">
        <button className="public-cart-btn" onClick={() => navigate('/cart')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5EAA7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        <div className="public-profile-icon">
          {user ? user.name?.charAt(0).toUpperCase() : '|'}
        </div>

        {user && (
          <button className="public-logout-btn" onClick={handleLogout}>
            Log out
          </button>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;