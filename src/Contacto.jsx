import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HeaderIcons from './components/HeaderIcons';
import './styles/global.css';

export default function Contacto() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/check-auth', {
          credentials: 'include'
        });
        const data = await response.json();
        setUserRole(data.rol);
      } catch (error) {
        console.error('Error al verificar el rol:', error);
      }
    };

    checkUserRole();
  }, []);

  return (
    <div className="contacto-container">
      <Sidebar userRole={userRole} />
      <main className="main-content">
        <header className="header">
          <HeaderIcons />
        </header>

        <section className="content">
          <div className="info-section">
            <h2>Sobre Nosotros</h2>
            <p>
              En <strong>Repuestos G.R.A</strong>, nos dedicamos a ofrecer piezas de vehículos de alta calidad a precios competitivos. 
              Contamos con una amplia variedad de repuestos para satisfacer las necesidades de nuestros clientes, tanto particulares como talleres.
              Nuestro compromiso es brindarte el mejor servicio y ayudarte a encontrar exactamente lo que buscas.
            </p>

            <h3>Información de Contacto</h3>
            <ul>
              <li><strong>Teléfono:</strong> +1 (809) 605-7725</li>
              <li><strong>Correo general:</strong> contacto@repuestosgra.com</li>
              <li><strong>Soporte técnico:</strong> soporte@repuestosgra.com</li>
              <li><strong>Dirección:</strong> No tenemos una dirección fija, pero puedes contactarnos a través de los medios de comunicación que te ofrecemos.</li>
              <li><strong>Horario:</strong> Lunes a Viernes de 8:00 AM - 6:00 PM</li>
            </ul>

            <div className="whatsapp-section">
              <h3>¿Prefieres escribirnos por WhatsApp?</h3>
              <a
                href="https://wa.me/18096057725"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button"
              >
                <img src="/WhatsApp.png" alt="WhatsApp" className="whatsapp-icon" />
                Escríbenos
              </a>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .contacto-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          background-color: #ffffff;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 20px;
          background-color: #24487f;
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
          padding: 40px;
          overflow-y: auto;
          display: flex;
          justify-content: center;
        }

        .info-section {
          max-width: 700px;
          width: 100%;
          color: #333;
        }

        .info-section h2 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .info-section p {
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .info-section h3 {
          margin-top: 30px;
          margin-bottom: 10px;
          font-size: 20px;
        }

        .info-section ul {
          list-style: none;
          padding-left: 0;
        }

        .info-section ul li {
          margin-bottom: 10px;
        }

        .whatsapp-section {
          margin-top: 30px;
        }

        .whatsapp-button {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #25d366;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          transition: background-color 0.2s ease;
        }

        .whatsapp-button:hover {
          background-color: #1ebe57;
        }

        .whatsapp-icon {
          width: 24px;
          height: 24px;
        }
      `}</style>
    </div>
  );
}
