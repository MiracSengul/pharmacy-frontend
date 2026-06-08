import { Link } from 'react-router-dom';
import './PublicFooter.css';

const PublicFooter = () => {
  return (
    <footer className="public-footer">
      <div className="footer-main">
        {/* Sol Blok - Logo ve Slogan */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="src//assets//logo.svg" alt="E-Pharmacy Logo" color='white'/>
            <span className="footer-logo-text">E-Pharmacy</span>
          </div>
          <p className="footer-tagline">
            Get the medicine to help you feel better, get back to your active life, and enjoy every moment.
          </p>
        </div>

        {/* Orta Blok - Navigasyon */}
        <div className="footer-nav">
          <Link to="/home" className="footer-link">Home</Link>
          <Link to="/medicine-store" className="footer-link">Medicine store</Link>
          <Link to="/medicine" className="footer-link">Medicine</Link>
        </div>

        {/* Sağ Blok - Sosyal Medya */}
        <div className="footer-social">
          <a
            href="https://www.facebook.com/goITclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Facebook"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/goitclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" />
            </svg>
          </a>
          <a
            href="https://www.youtube.com/c/GoIT"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="YouTube"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#4CAF50" />
            </svg>
          </a>
        </div>
      </div>

      {/* Alt Bölüm - Telif Hakkı */}
      <div className="footer-bottom">
        <span>© E-Pharmacy 2023. All Rights Reserved</span>
        <span className="footer-divider">|</span>
        <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
        <span className="footer-divider">|</span>
        <Link to="/terms" className="footer-bottom-link">Terms & Conditions</Link>
      </div>
    </footer>
  );
};

export default PublicFooter;