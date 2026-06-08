import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import './SharedLayout.css';

const sidebarItems = [
  { iconPath: 'src//assets//dashboard.svg', path: '/dashboard' },
  { iconPath: 'src//assets//orders.svg', path: '/orders' },
  { iconPath: 'src//assets//products.svg', path: '/products' },
  { iconPath: 'src//assets//customers.svg', path: '/customers' },
  { iconPath: 'src//assets//suppliers.svg', path: '/suppliers' },
];

const SharedLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout-wrapper">
      {/* Hamburger buton (sadece mobilde görünür) */}
      <button
        className="hamburger-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Header />

      <div className="layout-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          {sidebarItems.map((item, idx) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <div
                key={idx}
                className={`sidebar-icon ${isActive ? 'active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                title={item.path}
              >
                <img src={item.iconPath} alt="menu icon" />
              </div>
            );
          })}
        </aside>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SharedLayout;