import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { getProducts } from '../services/api';
import './ProductPage.css';

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProducts();
        const allProducts = res.data.data;
        const found = allProducts.find((p) => p._id === productId);
        if (found) {
          setProduct(found);
        } else {
          setError('Ürün bulunamadı.');
        }
      } catch (err) {
        console.error(err);
        setError('Ürün yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Lütfen önce giriş yapın');
      navigate('/login');
      return;
    }
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success(`${product.name} sepete eklendi`);
  };

  if (loading) {
    return (
      <div className="product-status">
        <CircularProgress size={36} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Yükleniyor...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-status">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Sol Kolon */}
        <div className="product-detail-left">
          <div className="product-detail-image">
            <img
              src={product.photo || '/placeholder.png'}
              alt={product.name}
              onError={(e) => {
                e.target.src = '/placeholder.png';
              }}
            />
          </div>
          <div className="product-detail-info">
            <div className="product-detail-header">
              <Typography variant="h5" fontWeight={700}>
                {product.name}
              </Typography>
              <Typography variant="h5" fontWeight={700} color="#5EAA7B">
                ৳{product.price?.toFixed(2)}
              </Typography>
            </div>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Brand: {product.suppliers?.[0]?.name || 'Generic'}
            </Typography>
            <div className="product-detail-actions">
              <div className="quantity-stepper">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
              <Button
                variant="contained"
                className="add-cart-btn"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
            </div>
          </div>
        </div>

        {/* Sağ Kolon */}
        <div className="product-detail-right">
          <div className="product-detail-tabs">
            <button
              className={`tab-btn ${
                activeTab === 'description' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`tab-btn ${
                activeTab === 'reviews' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          <div className="product-detail-tab-content">
            {activeTab === 'description' ? (
              <Typography variant="body1" color="text.secondary">
                Description unavailable.
              </Typography>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No reviews yet.
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;