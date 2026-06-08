import { useState } from 'react';
import { TextField, Button, Typography, Radio, RadioGroup, FormControlLabel, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import './CartPage.css';

const CartPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart') || '[]'));
  const [shipping, setShipping] = useState({ name: '', email: '', phone: '', address: '' });
  const [payment, setPayment] = useState('cod');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantity = (id, qty) => {
    const updated = cart.map(item => item._id === id ? { ...item, quantity: Math.max(1, qty) } : item);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleRemove = (id) => {
    const updated = cart.filter(item => item._id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handlePlaceOrder = async () => {
    if (!shipping.name || !shipping.email || !shipping.phone || !shipping.address) {
      return toast.error('Lütfen tüm teslimat bilgilerini doldurun');
    }
    try {
      await api.post('/orders', {
        customerName: shipping.name,
        customerEmail: shipping.email,
        address: shipping.address,
        products: cart.map(item => ({
          product: item._id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        type: 'income',
        status: 'Pending'
      });
      localStorage.removeItem('cart');
      setCart([]);
      toast.success('Sipariş başarıyla oluşturuldu!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sipariş oluşturulamadı');
    }
  };

  return (
    <div className="cart-page">
      <Typography variant="h4" fontWeight={700} mb={3}>Cart</Typography>

      <div className="cart-layout">
        {/* Sol Kolon */}
        <div className="cart-main">
          {/* Teslimat Bilgileri */}
          <div className="cart-section">
            <Typography variant="h6" fontWeight={600}>Enter shipping info</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Enter your shipping info where you'll get the product. You can also send any other location where you need the products.
            </Typography>
            <div className="shipping-grid">
              <div>
                <InputLabel>Name</InputLabel>
                <TextField fullWidth size="small" placeholder="Enter text" value={shipping.name} onChange={e => setShipping({...shipping, name: e.target.value})} />
              </div>
              <div>
                <InputLabel>Email</InputLabel>
                <TextField fullWidth size="small" placeholder="Enter text" value={shipping.email} onChange={e => setShipping({...shipping, email: e.target.value})} />
              </div>
              <div>
                <InputLabel>Phone</InputLabel>
                <TextField fullWidth size="small" placeholder="Enter text" value={shipping.phone} onChange={e => setShipping({...shipping, phone: e.target.value})} />
              </div>
              <div>
                <InputLabel>Address</InputLabel>
                <TextField fullWidth size="small" placeholder="Enter text" value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Ödeme Yöntemi */}
          <div className="cart-section">
            <Typography variant="h6" fontWeight={600}>Payment method</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Select a payment method. Additional charges may apply depending on your choice.
            </Typography>
            <RadioGroup value={payment} onChange={e => setPayment(e.target.value)}>
              <FormControlLabel value="cod" control={<Radio sx={{ color: '#5EAA7B', '&.Mui-checked': { color: '#5EAA7B' } }} />} label="Cash On Delivery" />
              <FormControlLabel value="bank" control={<Radio sx={{ color: '#5EAA7B', '&.Mui-checked': { color: '#5EAA7B' } }} />} label="Bank" />
            </RadioGroup>
          </div>

          {/* Sipariş Detayı */}
          <div className="cart-section">
            <Typography variant="h6" fontWeight={600}>Order details</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Review your order summary before placing it.
            </Typography>
            <div className="total-box">
              <Typography variant="subtitle1" fontWeight={700}>Total:</Typography>
              <Typography variant="subtitle1" fontWeight={700} color="#5EAA7B">৳ {total.toFixed(2)}</Typography>
            </div>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handlePlaceOrder}
              className="place-order-btn"
              sx={{ mt: 2, borderRadius: '20px', bgcolor: '#5EAA7B', '&:hover': { bgcolor: '#4b8f65' } }}
            >
              Place order
            </Button>
          </div>
        </div>

        {/* Sağ Kolon (Sepetteki Ürünler) */}
        <div className="cart-items-column">
          {cart.length === 0 ? (
            <Typography color="text.secondary" align="center" mt={4}>Sepetiniz boş.</Typography>
          ) : (
            cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-left">
                  <div className="cart-item-image">
                    <img src={item.photo || '/placeholder.png'} alt={item.name} />
                  </div>
                  <div>
                    <Typography variant="body1" fontWeight={600}>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.category || 'Medicine'}</Typography>
                  </div>
                </div>
                <div className="cart-item-right">
                  <Typography variant="body2" fontWeight={500}>৳ {item.price?.toFixed(2)}</Typography>
                  <div className="cart-stepper">
                    <button onClick={() => handleQuantity(item._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <Button
                    size="small"
                    onClick={() => handleRemove(item._id)}
                    className="remove-btn"
                    startIcon={<DeleteIcon />}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;