import { Link } from 'react-router-dom';
import { Typography, Button } from '@mui/material';
import pharmaciesData from '../data/pharmacies.json';
import reviewsData from '../data/reviews.json';
import './HomePage.css';

const HomePage = () => {
  const pharmacies = pharmaciesData.slice(0, 6);
  const reviews = reviewsData;

  return (
    <div className="home-page">

      {/* 1. Hero + Özellik Kartları */}
      <section className="hero-wrapper">
        <div className="hero-section">
          <div className="hero-content">
            <Typography variant="h1" className="hero-title">
              Your medication delivered
            </Typography>
            <Typography variant="body1" className="hero-subtitle">
              Say goodbye to all your healthcare worries with us
            </Typography>
          </div>
          <div className="hero-pills">
            <img src="/assets/green_pills.png" alt="floating pills" />
          </div>
        </div>

        {/* 2. Özellik Kartları (overlap yapacak) */}
        <div className="feature-cards">
          <div className="feature-card">
            <span className="feature-number">1</span>
            <Typography variant="h6" className="feature-title">Huge Sale</Typography>
            <Typography variant="h3" className="feature-value" sx={{ color: '#5EAA7B' }}>70%</Typography>
            <Link to="/medicine?discount=70" className="feature-link">Shop now</Link>
          </div>
          <div className="feature-card">
            <span className="feature-number">2</span>
            <Typography variant="h6" className="feature-title">Secure delivery</Typography>
            <Typography variant="h3" className="feature-value" sx={{ color: '#1976d2' }}>100%</Typography>
            <Link to="/medicine-store" className="feature-link">Read more</Link>
          </div>
          <div className="feature-card">
            <span className="feature-number">3</span>
            <Typography variant="h6" className="feature-title">Off</Typography>
            <Typography variant="h3" className="feature-value" sx={{ color: '#f57c00' }}>35%</Typography>
            <Link to="/medicine?discount=35" className="feature-link">Shop now</Link>
          </div>
        </div>
      </section>

      {/* 3. Yakındaki Eczaneler */}
      <section className="stores-section">
        <Typography variant="h4" className="section-title">Your Nearest Medicine Store</Typography>
        <Typography variant="body2" className="section-subtitle">
          Search for Medicine, Filter by your location
        </Typography>

        <div className="stores-grid">
          {pharmacies.map((pharm, idx) => (
            <div className="store-card" key={idx}>
              <div className="store-card-top">
                <Typography variant="h6" className="store-name">{pharm.name}</Typography>
                <span className={`store-status ${pharm.rating >= 3 ? 'open' : 'close'}`}>
                  {pharm.rating >= 3 ? 'OPEN' : 'CLOSE'}
                </span>
              </div>
              <div className="store-info">
                <div className="store-info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5EAA7B" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <Typography variant="body2">{pharm.address}</Typography>
                </div>
                <div className="store-info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5EAA7B" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <Typography variant="body2">{pharm.phone}</Typography>
                </div>
              </div>
              {/* Dekoratif dalga */}
              <div className="store-card-wave" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Aksiyon Banner'ı */}
      <section className="action-banner">
        <div className="action-banner-left">
          <Typography variant="h4" className="banner-title">
            Add your local pharmacy online now
          </Typography>
          <Typography variant="body1" className="banner-text">
            Enjoy the convenience of having your prescriptions filled from home by connecting with your community pharmacy through our online platform.
          </Typography>
          <Button variant="outlined" size="large" component={Link} to="/medicine-store"
            className="banner-btn">
            Buy medicine
          </Button>
        </div>
        <div className="action-banner-right">
          <img src="/assets/woman.png" alt="woman using phone" />
        </div>
      </section>

      {/* 5. İkonlu Özellik Şeridi */}
      <section className="features-strip">
        {['Take user orders form online', 'Create your shop profile', 'Manage your store', 'Get more orders', 'Storage shed'].map((text, idx) => (
          <div className="features-strip-item" key={idx}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#5EAA7B">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <Typography variant="body2">{text}</Typography>
          </div>
        ))}
      </section>

      {/* 6. Yorumlar */}
      <section className="reviews-section">
        <Typography variant="h4" className="section-title">Reviews</Typography>
        <Typography variant="body2" className="section-subtitle">
          Search for Medicine, Filter by your location
        </Typography>

        <div className="reviews-grid">
          {reviews.map((review, idx) => (
            <div className="review-card" key={idx}>
              <div className="review-avatar">
                {review.name.charAt(0).toUpperCase()}
              </div>
              <Typography variant="h6" className="review-name">{review.name}</Typography>
              <Typography variant="body2" className="review-text">
                "{review.testimonial}"
              </Typography>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;