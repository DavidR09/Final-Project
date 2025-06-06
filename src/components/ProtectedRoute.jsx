import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { userRole, isLoading, isAuthenticated, hasRole } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: 'Segoe UI', sans-serif;
          }

          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #24487f;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'administrador') {
    console.log('Acceso permitido - Usuario es administrador');
    return children;
  }

  if (allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) {
    console.log('Acceso denegado - Rol requerido no coincide', {
      userRole,
      allowedRoles,
    });
    return <Navigate to="/acceso-denegado" replace />;
  }

  console.log('Acceso permitido - Rol autorizado', {
    userRole,
    allowedRoles,
  });
  return children;
}; 