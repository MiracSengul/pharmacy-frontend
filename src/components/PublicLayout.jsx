import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';
import './PublicLayout.css';

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <PublicHeader />
      <main className="public-content">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;