import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { Typography, Button, TextField, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import './MedicinePage.css';

const categoriesList = [
  'All', 'Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care',
  'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care',
];

const ITEMS_PER_PAGE = 12;

const MedicinePage = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter) params.search = filter;
      if (category !== 'All') params.category = category;
      const res = await getProducts(params);
      setProducts(res.data.data);
      setCurrentPage(1); // filtre değişince ilk sayfaya dön
    } catch (err) {
      toast.error('Ürünler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFilter = () => {
    fetchProducts();
  };

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error('Lütfen önce giriş yapın veya kayıt olun');
      navigate('/login');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Ürün sepete eklendi');
  };

  // Pagination hesaplamaları
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="medicine-page">
      {/* Başlık */}
      <Typography variant="h4" fontWeight={700} mb={2}>
        Medicine
      </Typography>

      {/* Filtre Alanı */}
      <div className="medicine-filters">
        <TextField
          select
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="filter-select"
        >
          {categoriesList.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat === 'All' ? 'Product category' : cat}
            </MenuItem>
          ))}
        </TextField>

        <div className="filter-search-wrapper">
          <input
            type="text"
            placeholder="Search medicine"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-search-input"
          />
          <svg
            className="filter-search-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <Button
          variant="contained"
          onClick={handleFilter}
          className="filter-btn"
          startIcon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          }
        >
          Filter
        </Button>
      </div>

      {/* Ürün Grid */}
      {loading ? (
        <Typography align="center" mt={4}>
          Yükleniyor...
        </Typography>
      ) : products.length === 0 ? (
        <Typography align="center" mt={4} color="text.secondary">
          Nothing was found for your request
        </Typography>
      ) : (
        <div className="medicine-grid">
          {paginatedProducts.map((product) => (
            <div className="medicine-card" key={product._id}>
              {/* Görsel Alanı */}
              <div className="medicine-card-image">
                <img
                  src={product.photo || '/placeholder.png'}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder.png';
                  }}
                />
              </div>

              {/* Bilgi Alanı */}
              <div className="medicine-card-body">
                <div className="medicine-card-header">
                  <Typography variant="subtitle1" fontWeight={700}>
                    {product.name}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={700} color="#5EAA7B">
                    ৳{product.price?.toFixed(2)}
                  </Typography>
                </div>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  {product.category || 'General'}
                </Typography>

                <div className="medicine-card-footer">
                  <Button
                    variant="contained"
                    size="small"
                    className="add-cart-btn"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to cart
                  </Button>

                  <Button
                    size="small"
                    className="details-btn"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Noktaları */}
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

export default MedicinePage;