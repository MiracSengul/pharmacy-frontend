import { useEffect, useState } from 'react';
import { getOrders } from '../services/api';
import { Typography, TextField, Button } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import toast from 'react-hot-toast';
import './OrdersPage.css';

const STATUS_STYLES = {
  Completed: 'status-completed',
  Confirmed: 'status-confirmed',
  Pending: 'status-pending',
  Cancelled: 'status-cancelled',
  Processing: 'status-processing',
  Shipped: 'status-shipped',
  Delivered: 'status-delivered',
};

const ITEMS_PER_PAGE = 10; // her sayfada 10 sipariş

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getOrders(params);
      setOrders(res.data.data);
      setCurrentPage(1); // filtre değişince ilk sayfaya dön
    } catch (err) {
      toast.error('Siparişler yüklenirken hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilter = () => {
    fetchOrders({ search: filter });
  };

  // Sayfalama için toplam sayfa sayısı
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

  // Mevcut sayfadaki siparişler
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatPrice = (order) => {
    const price = order.totalAmount ?? order.price;
    if (price === undefined || price === null) return '—';
    const num = parseFloat(price);
    if (isNaN(num)) return '—';
    return `$${num.toFixed(2)}`;
  };

  const formatProductCount = (order) => {
    if (Array.isArray(order.products)) {
      return order.products.length;
    }
    if (typeof order.products === 'string' || typeof order.products === 'number') {
      const num = parseInt(order.products, 10);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  return (
    <div className="orders-page">
      <Typography variant="h5" fontWeight={600} mb={2}>
        All orders
      </Typography>

      <div className="orders-toolbar">
        <TextField
          variant="outlined"
          size="small"
          placeholder="User Name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="orders-search"
        />
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={handleFilter}
          sx={{
            bgcolor: '#5EAA7B',
            textTransform: 'none',
            borderRadius: 2,
            px: 3,
            '&:hover': { bgcolor: '#4b8f65' },
          }}
        >
          Filter
        </Button>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>User Info</th>
              <th>Address</th>
              <th>Products</th>
              <th>Order date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="orders-empty">Yükleniyor...</td>
              </tr>
            ) : paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="orders-empty">Henüz sipariş bulunmamaktadır.</td>
              </tr>
            ) : (
              paginatedOrders.map((order) => (
                <tr key={order._id || order.name}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {order.customerName?.charAt(0)?.toUpperCase() || order.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <span className="user-name">{order.customerName || order.name}</span>
                    </div>
                  </td>
                  <td>{order.address}</td>
                  <td>{String(formatProductCount(order)).padStart(2, '0')}</td>
                  <td>
                    {(() => {
                      const dateStr = order.orderDate || order.order_date;
                      if (!dateStr) return '—';
                      const date = new Date(dateStr);
                      if (isNaN(date.getTime())) return dateStr;
                      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    })()}
                  </td>
                  <td className="order-price">{formatPrice(order)}</td>
                  <td>
                    <span className={`status-badge ${STATUS_STYLES[order.status] || 'status-default'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Sayfalama Noktaları (dinamik) */}
      {totalPages > 1 && (
        <div className="pagination-dots">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <span
              key={page}
              className={`dot ${page === currentPage ? 'active' : ''}`}
              onClick={() => goToPage(page)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;