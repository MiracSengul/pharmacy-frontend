import { useState, useEffect } from 'react';
import { Typography, Button } from '@mui/material';
import nearestPharmaciesData from '../data/nearest_pharmacies.json';
import './MedicineStorePage.css';

const MedicineStorePage = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const sorted = [...nearestPharmaciesData].sort((a, b) => b.rating - a.rating);
    setStores(sorted);
  }, []);

  return (
    <div className="medicine-store-page">
      <Typography variant="h4" className="store-page-title">
        Medicine store
      </Typography>

      <div className="store-grid">
        {stores.map((store, idx) => {
          const isOpen = store.rating >= 3;
          return (
            <div className="store-card" key={idx}>
              {/* Dekoratif arka plan dalgası */}
              <div className="store-card-pattern" />

              {/* Üst içerik */}
              <div className="store-card-body">
                <Typography variant="h6" className="store-card-name">
                  {store.name}
                </Typography>

                <div className="store-card-info">
                  <div className="info-row">
                    <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5EAA7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <Typography variant="body2" className="info-text">
                      {store.address}, {store.city}
                    </Typography>
                  </div>

                  <div className="info-row">
                    <svg className="info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5EAA7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <Typography variant="body2" className="info-text">
                      {store.phone}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Alt aksiyon satırı */}
              <div className="store-card-footer">
                <Button className="visit-btn" disableElevation>
                  Visit Store
                </Button>

                <div className="rating-status-group">
                  <div className="rating">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24" strokeWidth="1">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <Typography variant="body2" className="rating-value">
                      {store.rating}
                    </Typography>
                  </div>

                  <span className={`status-badge ${isOpen ? 'open' : 'close'}`}>
                    {isOpen ? 'OPEN' : 'CLOSE'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicineStorePage;