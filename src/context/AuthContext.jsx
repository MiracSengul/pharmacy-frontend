import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { loginUser, logoutUser, getUserInfo } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Token varsa kullanıcıyı yükle
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserInfo()
        .then((res) => setUser(res.data.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    navigate('/home');
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // Hata olsa bile client tarafında temizle
    }
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};