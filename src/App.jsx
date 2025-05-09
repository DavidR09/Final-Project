import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="left-section">
        <img src="/public/fotinicio.jpg" alt="Dashboard ilustración" />
      </div>
      <div className="right-section">
        <div className="logo-container">
          <img src="/public/Logo.png" alt="Logo de Repuestos G.R.A" />
        </div>
        <h1>Bienvenido a <span className="highlight">Repuestos G.R.A</span></h1>
        <p className="intro-text">
          Somos una plataforma de comercio electrónico especializada en la venta de piezas automotrices 
          para vehículos de cualquier marca, modelo o año. Nuestro principal objetivo es resolver la mayor 
          necesidad del mercado: <strong>la demora en la obtención de piezas esenciales</strong>.
        </p>
        <div className="button-group">
          <button onClick={() => navigate('/login')} className="primary-btn">
            Iniciar Sesión
          </button>
          <button onClick={() => navigate('/register')} className="secondary-btn">
            Registrarse
          </button>
        </div>
      </div>

      <style jsx>{`
        .welcome-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .left-section {
          flex: 1;
          background-color: #2a2829;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .left-section img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .right-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background-color: white;
          color: #111;
          padding: 40px;
        }

        .logo-container {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .logo-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .right-section h1 {
          font-size: 36px;
          margin-bottom: 20px;
        }

        .highlight {
          color: #668284;
        }

        .intro-text {
          font-size: 18px;
          color: #333;
          margin-bottom: 15px;
          max-width: 600px;
        }

        .button-group {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .primary-btn,
        .secondary-btn {
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-btn {
          background-color: #668284;
          color: white;
        }

        .primary-btn:hover {
          background-color: #b9d7d9;
          color: black;
        }

        .secondary-btn {
          background-color: #e0e7ff;
          color: #1e3a8a;
        }

        .secondary-btn:hover {
          background-color: #c7d2fe;
        }
      `}</style>
    </div>
  );
}
