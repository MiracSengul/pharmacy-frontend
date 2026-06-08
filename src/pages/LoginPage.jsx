import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../utils/validators';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import './LoginPage.css'; // eski CSS dosyanın yolu
import pill3D from '../assets/pill-3d.png'; // varsa 3D hap görselin

const LoginPage = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success('Giriş başarılı!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Logo */}
      <div className="login-logo">
        <div className="login-logo-icon">
          <div className="square" />
          <div className="square" />
          <div className="square" />
        </div>
        <span className="login-logo-text">E-Pharmacy</span>
      </div>

      {/* Ana İçerik Grid */}
      <div className="login-container">
        {/* Sol Sütun */}
        <div className="login-left">
          <img
            src={pill3D}
            alt="3D Pill"
            className="login-pill-image"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 className="login-title">
            Your medication, <br />
            delivered Say goodbye <br />
            to all <span className="highlight">your healthcare</span> <br />
            worries with us
          </h1>
        </div>

        {/* Sağ Sütun - Form */}
        <div className="login-right">
          <input
            className="login-input"
            type="text"
            placeholder="Email/Phone No"
            {...register('email')}
          />
          {errors.email && (
            <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '-15px' }}>
              {errors.email.message}
            </span>
          )}

          <input
            className="login-input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && (
            <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '-15px' }}>
              {errors.password.message}
            </span>
          )}

          <button
            className="login-btn"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Log in'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
            Hesabınız yok mu?{' '}
            <Link to="/register" style={{ color: '#5EAA7B', fontWeight: 600 }}>
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;