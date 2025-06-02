import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigationLock = (isBlocked) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isBlocked) return;

    const unloadHandler = (e) => {
      e.preventDefault();
      e.returnValue = 'Tienes cambios sin guardar. ¿Seguro que quieres salir?';
    };

    window.addEventListener('beforeunload', unloadHandler);
    return () => window.removeEventListener('beforeunload', unloadHandler);
  }, [isBlocked, navigate]);
};