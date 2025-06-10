import React, { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Componente de carga memoizado
const MemoizedLoadingSpinner = memo(() => (
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
));

MemoizedLoadingSpinner.displayName = 'MemoizedLoadingSpinner';

// Componente principal memoizado
export const ProtectedRoute = memo(({ children, allowedRoles = [] }) => {
  const { userRole, isLoading, isAuthenticated } = useAuth();

  // Mostrar spinner de carga mientras se verifica la autenticación
  if (isLoading) {
    return <MemoizedLoadingSpinner />;
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar roles permitidos
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Si el usuario no tiene el rol requerido, redirigir a una página de acceso denegado
    return <Navigate to="/acceso-denegado" replace />;
  }

  // Renderizar el contenido protegido
  return children;
});

ProtectedRoute.displayName = 'ProtectedRoute'; 