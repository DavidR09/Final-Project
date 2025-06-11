import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../config/axios';

export const useAuth = () => {
  const [userRole, setUserRole] = useState(() => sessionStorage.getItem('userRole'));
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('isAuthenticated') === 'true');
  const navigate = useNavigate();
  const location = useLocation();

  // Lista de rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/login', '/register'];

  const checkAuth = useCallback(async () => {
    // Si estamos en una ruta pública, no verificamos autenticación
    if (publicRoutes.includes(location.pathname)) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Verificando autenticación...');
      const response = await axiosInstance.get('/api/auth/check-auth');
      
      console.log('Respuesta de autenticación:', response.data);
      
      if (response.data && response.data.rol) {
        console.log('Usuario autenticado con rol:', response.data.rol);
        setUserRole(response.data.rol);
        setIsAuthenticated(true);
        sessionStorage.setItem('userRole', response.data.rol);
        sessionStorage.setItem('isAuthenticated', 'true');
      } else {
        console.log('Usuario no autenticado - datos inválidos');
        handleAuthFailure();
      }
    } catch (error) {
      console.error('Error en checkAuth:', error);
      
      if (error.response) {
        console.error('Detalles del error:', error.response);
        
        // Solo redirigir al login si no estamos ya en una ruta pública
        if (error.response.status === 401 && !publicRoutes.includes(location.pathname)) {
          handleAuthFailure();
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [location.pathname, navigate]);

  const handleAuthFailure = useCallback(() => {
    // Limpiar estado y sessionStorage
    setIsAuthenticated(false);
    setUserRole(null);
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');

    // Solo redirigir si no estamos ya en una ruta pública
    if (!publicRoutes.includes(location.pathname)) {
      console.log('Redirigiendo a login por fallo de autenticación');
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [location.pathname, navigate]);

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      handleAuthFailure();
    }
  }, [handleAuthFailure]);

  useEffect(() => {
    // Solo verificar autenticación si:
    // 1. No estamos en una ruta pública, o
    // 2. Tenemos datos de autenticación en sessionStorage
    if (!publicRoutes.includes(location.pathname) || sessionStorage.getItem('isAuthenticated')) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [checkAuth, location.pathname]);

  return { 
    userRole, 
    isLoading, 
    isAuthenticated, 
    checkAuth, 
    logout,
    // Exponer la función handleAuthFailure para uso en otros componentes
    handleAuthFailure 
  };
}; 