import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('/api/verify-auth', { withCredentials: true });
      } catch (error) {
  console.error('Error de autenticación:', error);
  navigate('/login', { replace: true });
}
    };

    checkAuth();
  }, [navigate]);
};