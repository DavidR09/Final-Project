import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useAuth = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/check-auth', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.authenticated && response.data.rol) {
        setUserRole(response.data.rol);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      setIsAuthenticated(false);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        // Otros errores (404, 500, etc.)
        console.error('Error detallado:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  return { userRole, isLoading, isAuthenticated, checkAuth };
}; 