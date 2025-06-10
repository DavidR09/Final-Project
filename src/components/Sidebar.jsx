import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ userRole }) {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="logo-wrapper" onClick={() => navigate('/inicio_client')}>
        <img src="/Logo.png" alt="Logo" />
      </div>
      <ul>
        {userRole === 'administrador' ? (
          <>
            <li onClick={() => navigate('/inicio_client')}>Inicio</li>
            <li onClick={() => navigate('/productos')}>Piezas</li>
            <li onClick={() => navigate('/pedidos')}>Pedidos</li>
            <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
            <li onClick={() => navigate('/Inicio')}>Volver al Panel Admin</li>
          </>
        ) : (
          <>
            <li onClick={() => navigate('/inicio_client')}>Inicio</li>
            <li onClick={() => navigate('/productos')}>Piezas</li>
            <li onClick={() => navigate('/pedidos')}>Pedidos</li>
            <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
          </>
        )}
      </ul>

      <style>{`
        .sidebar {
          width: 250px;
          background-color: #24487f;
          color: white;
          padding: 20px;
        }

        .logo-wrapper {
          width: 120px;
          height: 120px;
          background-color: white;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .logo-wrapper img {
          width: 90%;
          height: 90%;
          object-fit: contain;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
        }

        .sidebar li {
          margin-bottom: 15px;
          cursor: pointer;
          padding: 8px;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .sidebar li:hover {
          background-color: #333;
        }

        .sidebar li:active {
          background-color: #1b355b;
        }
      `}</style>
    </aside>
  );
} 