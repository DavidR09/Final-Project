import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/global.css';

export default function Inicio() {
  const navigate = useNavigate();


  // Mantenemos el sidebar igual con las rutas

  return (
    <div className="inicio-container">
      <aside className="sidebar">
        <div className="logo-wrapper" onClick={() => navigate('/inicio')}>
          <img src="/Logo.png" alt="Logo" />
        </div>

        <ul>
          <li onClick={() => navigate('/Inicio')}>Panel de Administración</li>
          <li onClick={() => navigate('/register')}>Registrar Usuario</li>
          <li onClick={() => navigate('/register-taller')}>Registrar Taller</li>
          <li onClick={() => navigate('/register-repuesto')}>Registrar Repuesto</li>
          <li onClick={() => navigate('/Inicio_Client')}>Ver Vista Cliente</li>
          <li onClick={() => navigate('/')}>Cerrar sesión</li>
        </ul>

      </aside>

      <main className="main-content">
        

        <section className="content">
          <div className="register-text">
            Repuestos G.R.A
          </div>
        </section>
      </main>

      <style>{`
        .inicio-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          background-color: #ffffff;
        }

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

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background-color: #24487f;
          flex-wrap: wrap;
        }

        .buscador {
          padding: 10px 15px;
          width: 300px;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          color: #24487f;
          background-color: white;
          outline: none;
        }

        .buscador:disabled {
          background-color: #ddd;
          cursor: not-allowed;
        }

        .iconos-header {
          display: flex;
          gap: 15px;
        }

        .iconos-header img {
          width: 30px;
          height: 30px;
        }

        .content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #ffffff;
          color: black;
          font-size: 48px;
          font-weight: bold;
          user-select: none;
        }

        .register-text {
          /* Extra centering and styling if needed */
        }
      `}</style>
    </div>
  );
}
