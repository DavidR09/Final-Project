import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { data } = await axios.get('/api/verify-auth', { 
          withCredentials: true 
        });
        
        const hasPermission = allowedRoles.length === 0 || 
                            allowedRoles.includes(data.user.rol);
        
        setIsAuthorized(hasPermission);
      } catch (error) {
  console.error('Error verificando autenticación:', error);
  setIsAuthorized(false);
}
    };

    verifyAuth();
  }, [location, allowedRoles]);

  if (isAuthorized === null) return <div>Verificando...</div>;
  if (!isAuthorized) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
};

export default ProtectedRoute;