import { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';
import { Typography, Box } from '@mui/material';
import toast from 'react-hot-toast';
import './DashboardPage.css';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data.data))
      .catch((err) => {
        toast.error('Dashboard verisi alınamadı');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="dashboard-content">
        <Typography p={3}>Yükleniyor...</Typography>
      </div>
    );
  if (!data)
    return (
      <div className="dashboard-content">
        <Typography p={3}>Veri alınamadı.</Typography>
      </div>
    );

  const { statistics, recentCustomers, incomeExpenses } = data;

  // İstatistik kartları
  const statCards = [
    {
      title: 'All products',
      value: statistics.totalProducts,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      ),
      active: true,
    },
    {
      title: 'All suppliers',
      value: statistics.totalSuppliers,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      active: false,
    },
    {
      title: 'All customers',
      value: statistics.totalCustomers,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      ),
      active: false,
    },
  ];

  return (
    <div className="dashboard-content">
      {/* İstatistik Kartları */}
      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className={`stat-card ${card.active ? 'active' : ''}`}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-info">
              <h4>{card.title}</h4>
              <div className="stat-value">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Alt Paneller */}
      <div className="panels-grid">
        {/* Recent Customers */}
        <div className="panel">
          <div className="panel-header">Recent Customers</div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th className="text-right">Spent</th>
              </tr>
            </thead>
            <tbody>
              {recentCustomers.length > 0 ? (
                recentCustomers.map((cust) => (
                  <tr key={cust._id}>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {cust.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="customer-name">{cust.name}</span>
                      </div>
                    </td>
                    <td className="customer-email">{cust.email}</td>
                    <td className="customer-spent">
                      ${parseFloat(cust.totalSpent).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="empty-state">
                    Henüz müşteri bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Income / Expenses */}
        <div className="panel">
          <div className="panel-header">Income / Expenses</div>
          <div className="panel-subtitle">Today</div>
          <ul className="income-list">
            {incomeExpenses.length > 0 ? (
              incomeExpenses.map((item, idx) => {
                const isIncome = item.type === 'income';
                const isExpense = item.type === 'expense';
                const badgeClass = isIncome
                  ? 'badge-income'
                  : isExpense
                  ? 'badge-expense'
                  : 'badge-error';
                const amountClass = isIncome
                  ? 'amount-positive'
                  : isExpense
                  ? 'amount-negative'
                  : 'amount-error';

                return (
                  <li key={idx} className="income-item">
                    <div className="income-left">
                      <span className={`badge ${badgeClass}`}>
                        {isIncome ? 'Income' : isExpense ? 'Expense' : 'Error'}
                      </span>
                      <div>
                        <div className="item-title">{item.title}</div>
                        {item.email && <div className="item-email">{item.email}</div>}
                      </div>
                    </div>
                    <span className={`amount ${amountClass}`}>
                      {isIncome ? '+' : isExpense ? '-' : ''}${Math.abs(item.amount).toLocaleString()}
                    </span>
                  </li>
                );
              })
            ) : (
              <li className="income-item empty-state">
                Henüz gelir/gider kaydı bulunmamaktadır.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;