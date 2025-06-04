import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AccesoDenegado() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const handleRedirect = () => {
    // Redirigir según el rol del usuario
    if (userRole === 'administrador') {
      navigate('/Inicio');
    } else {
      navigate('/Inicio_Client');
    }
  };

  return (
    <div className="acceso-denegado">
      <img src="/acceso-denegado.png" alt="Acceso Denegado" />
      <h1>Acceso Denegado</h1>
      <p>Lo sentimos, no tienes permisos para acceder a esta página.</p>
      <button onClick={handleRedirect}>Volver al Inicio</button>

      <style jsx>{`
        .acceso-denegado {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
          font-family: 'Segoe UI', sans-serif;
          background-color: #f8f9fa;
        }

        img {
          width: 200px;
          margin-bottom: 30px;
        }

        h1 {
          color: #24487f;
          margin-bottom: 15px;
        }

        p {
          color: #666;
          margin-bottom: 30px;
        }

        button {
          background-color: #24487f;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        button:hover {
          background-color: #1b355b;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
} 