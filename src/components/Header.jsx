import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-brand">
          <div className="header-logo">
            {/* Logonu assets klasöründen çekecek */}
            <img src="src//assets//logo.svg" alt="E-Pharmacy Logo" />
          </div>
          <div className="header-text">
            <div className="header-title">Medicine store</div>
            <div className="header-sub">
              Dashboard | {user?.email || 'vendor@gmail.com'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="header-right">
        {/* Görseldeki gibi sadece dairesel yeşil buton */}
        <button className="header-profile-btn" onClick={logout} title="Logout">
          <img src="src//assets//logout.svg" alt="Profile" />
        </button>
      </div>
    </header>
  );
};

export default Header;