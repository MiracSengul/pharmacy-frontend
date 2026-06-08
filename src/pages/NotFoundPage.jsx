import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">🔍</div>
        <h1 className="not-found-title">404</h1>
        <p className="not-found-subtitle">Sayfa Bulunamadı</p>
        <p className="not-found-description">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        </p>
        <div className="not-found-actions">
          <Link to="/dashboard" className="not-found-btn">
            Dashboard'a Dön
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;