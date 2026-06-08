import { useEffect, useState } from 'react';
import { getCustomers } from '../services/api';
import { Typography, TextField, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CustomersPage.css';

const ITEMS_PER_PAGE = 10;

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const fetchCustomers = async (params = {}) => {
    try {
      const res = await getCustomers(params);
      setCustomers(res.data.data);
      setCurrentPage(1);
    } catch (err) {
      toast.error('Müşteriler yüklenirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleFilter = () => {
    fetchCustomers({ search: filter });
  };

  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = customers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="customers-page">
      {/* Üst araç çubuğu */}
      <div className="customers-toolbar">
        <TextField
          variant="outlined"
          size="small"
          placeholder="User Name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="customers-search"
        />
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={handleFilter}
          className="filter-btn"
        >
          Filter
        </Button>
      </div>

      {/* Ana kart ve tablo */}
      <div className="customers-card">
        <div className="table-header-banner">
          <Typography variant="h6" fontWeight={700} color="#111827">
            All Customers
          </Typography>
        </div>

        <table className="customers-table">
          <thead>
            <tr>
              <th>User Info</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Register date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  Henüz müşteri bulunmamaktadır.
                </td>
              </tr>
            ) : (
              paginatedCustomers.map((cust) => (
                <tr key={cust._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {cust.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-name">{cust.name}</span>
                    </div>
                  </td>
                  <td>{cust.email}</td>
                  <td>{cust.address || '—'}</td>
                  <td>{cust.phone || '—'}</td>
                  <td>
                    {cust.createdAt
                      ? new Date(cust.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : '—'}
                  </td>
                  <td>
                    <button
                      className="action-edit-btn"
                      onClick={() => navigate(`/customers/${cust._id}`)}
                      title="Edit / View"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sayfalama noktaları */}
      {totalPages > 1 && (
        <div className="pagination-dots">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <span
              key={page}
              className={`dot ${page === currentPage ? 'active' : ''}`}
              onClick={() => goToPage(page)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomersPage;