import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contactanos() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="left-section">
        <img src="/public/fotinicio.jpg" alt="Imagen de contacto" />
      </div>
      <div className="right-section">
        <div className="logo-container">
          <img src="/public/Logo.png" alt="Logo de Repuestos G.R.A" />
        </div>
        <h1>Contáctanos en <span className="highlight">Repuestos G.R.A</span></h1>
        <p className="intro-text">
          Si necesitas asistencia, información sobre nuestras piezas o tienes alguna consulta,
          no dudes en comunicarte con nosotros. Estamos disponibles para ayudarte en todo momento.
        </p>
        <p className="intro-text"><strong>Teléfono:</strong> +1 (809) 605-7725</p>
        <p className="intro-text"><strong>Correo electrónico:</strong> contacto@repuestosgra.com</p>
        <p className="intro-text"><strong>Dirección:</strong> Av. Principal #45, Santiago de los Caballeros, R.D.</p>
        <p className="intro-text"><strong>Horario:</strong> Lunes a Viernes de 8:00 a.m. a 6:00 p.m.</p>

        <div className="button-group">
          <button onClick={() => navigate('/')} className="primary-btn">
            Volver al Inicio
          </button>
          <a href="https://wa.me/18096057725" target="_blank" rel="noopener noreferrer" className="secondary-btn">
            WhatsApp
          </a>
        </div>
      </div>

      <style>{`
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
          color: #24487f;
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
          text-decoration: none;
        }

        .primary-btn {
          background-color: #24487f;
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