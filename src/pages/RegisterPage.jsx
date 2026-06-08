import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import './RegisterPage.css';
import pill3D from '../assets/pill-3d.png';

const registerSchema = yup.object({
  name: yup.string().required('İsim zorunludur').min(2, 'En az 2 karakter'),
  email: yup.string().email('Geçerli e-posta giriniz').required('E-posta zorunludur'),
  password: yup.string().min(6, 'Şifre en az 6 karakter').required('Şifre zorunludur'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Şifreler eşleşmiyor')
    .required('Şifre tekrarı zorunludur'),
});

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/user/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Logo */}
      <div className="register-logo">
        <div className="register-logo-icon">
          <div className="square" />
          <div className="square" />
          <div className="square" />
        </div>
        <span className="register-logo-text">E-Pharmacy</span>
      </div>

      {/* Ana İçerik Grid */}
      <div className="register-container">
        {/* Sol Sütun */}
        <div className="register-left">
          <img
            src={pill3D}
            alt="3D Pill"
            className="register-pill-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h1 className="register-title">
            Your medication, <br />
            delivered Say goodbye <br />
            to all <span className="highlight">your healthcare</span> <br />
            worries with us
          </h1>
        </div>

        {/* Sağ Sütun - Kayıt Formu */}
        <div className="register-right">
          <input
            className="register-input"
            type="text"
            placeholder="Full Name"
            {...register('name')}
          />
          {errors.name && (
            <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '-15px' }}>
              {errors.name.message}
            </span>
          )}

          <input
            className="register-input"
            type="text"
            placeholder="Email"
            {...register('email')}
          />
          {errors.email && (
            <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '-15px' }}>
              {errors.email.message}
            </span>
          )}

          <input
            className="register-input"
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && (
            <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '-15px' }}>
              {errors.password.message}
            </span>
          )}

          <input
            className="register-input"
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '-15px' }}>
              {errors.confirmPassword.message}
            </span>
          )}

          <button
            className="register-btn"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Register'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#5EAA7B', fontWeight: 600 }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;