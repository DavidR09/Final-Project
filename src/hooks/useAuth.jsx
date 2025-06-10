import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Configurar axios por defecto
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const useAuth = () => {
  const [userRole, setUserRole] = useState(() => {
    // Intentar recuperar el rol del sessionStorage
    const cachedRole = sessionStorage.getItem('userRole');
    return cachedRole || null;
  });
  const [isLoading, setIsLoading] = useState(!sessionStorage.getItem('userRole'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Intentar recuperar el estado de autenticación del sessionStorage
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });
  const navigate = useNavigate();

  // Memoizar la función checkAuth para evitar recreaciones innecesarias
  const checkAuth = useCallback(async () => {
    // Si ya tenemos los datos en caché y estamos autenticados, no hacer la llamada
    if (sessionStorage.getItem('userRole') && sessionStorage.getItem('isAuthenticated') === 'true') {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Verificando autenticación...');
      const response = await axios.get('http://localhost:3000/api/auth/check-auth', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Respuesta de autenticación:', response.data);
      
      if (response.data.authenticated && response.data.rol) {
        console.log('Usuario autenticado con rol:', response.data.rol);
        setUserRole(response.data.rol);
        setIsAuthenticated(true);
        // Guardar en sessionStorage
        sessionStorage.setItem('userRole', response.data.rol);
        sessionStorage.setItem('isAuthenticated', 'true');
      } else {
        console.log('Usuario no autenticado');
        setIsAuthenticated(false);
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('isAuthenticated');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error en checkAuth:', error);
      
      // Limpiar estado y sessionStorage
      setIsAuthenticated(false);
      setUserRole(null);
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('isAuthenticated');
      
      if (error.response) {
        console.error('Detalles del error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Si no está autenticado o el token expiró
        if (error.response.status === 401) {
          console.log('Redirigiendo a login por error 401');
          navigate('/login');
        }
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor');
      } else {
        console.error('Error al configurar la petición:', error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Limpiar caché al cerrar sesión
  const logout = useCallback(async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('isAuthenticated');
      setUserRole(null);
      setIsAuthenticated(false);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { userRole, isLoading, isAuthenticated, checkAuth, logout };
}; 