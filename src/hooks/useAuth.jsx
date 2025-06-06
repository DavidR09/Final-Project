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
      console.log('Verificando autenticación...');
      const response = await axios.get('/api/check-auth', {
        withCredentials: true
      });
      
      console.log('Respuesta de autenticación:', response.data);
      
      if (response.data.rol) {
        console.log('Rol detectado:', response.data.rol);
        setUserRole(response.data.rol);
        setIsAuthenticated(true);
        
        // Verificar si el rol es válido
        if (!['usuario', 'administrador'].includes(response.data.rol)) {
          console.warn('Rol no reconocido:', response.data.rol);
          setIsAuthenticated(false);
          navigate('/login');
          return;
        }
      } else {
        console.log('No se detectó rol en la respuesta');
        setIsAuthenticated(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      if (error.response) {
        console.error('Detalles del error:', error.response.data);
      }
      setIsAuthenticated(false);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  // Agregar función para verificar rol específico
  const hasRole = (requiredRole) => {
    if (requiredRole === 'administrador') {
      return userRole === 'administrador';
    }
    return userRole === requiredRole || userRole === 'administrador';
  };

  return { 
    userRole, 
    isLoading, 
    isAuthenticated, 
    checkAuth,
    hasRole 
  };
}; 