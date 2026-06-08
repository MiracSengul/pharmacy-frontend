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
      {/* Sol - Logo */}
      <div className="public-header-left">
        <div className="public-logo-icon">
          <span className="public-cross" />
          <span className="public-leaf" />
        </div>
        <span className="public-brand-text">E-Pharmacy</span>
      </div>

      {/* Orta - Navigasyon */}
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

      {/* Sağ - Kullanıcı / Auth Durumu */}
      <div className="public-header-right">
        {/* Sepet Butonu (her zaman) */}
        <button className="public-cart-btn" onClick={() => navigate('/cart')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5EAA7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {user ? (
          <>
            {/* Profil İkonu */}
            <div className="public-profile-icon">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {/* Logout */}
            <button className="public-logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            {/* Login Butonu */}
            <button className="public-login-btn" onClick={() => navigate('/login')}>
              Log in
            </button>
            {/* Register Butonu */}
            <button className="public-register-btn" onClick={() => navigate('/register')}>
              Register
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;