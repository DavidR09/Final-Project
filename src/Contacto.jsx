import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contacto() {
  const navigate = useNavigate();

  return (
    <div className="contacto-container">
      <aside className="sidebar">
        <div
          className="logo-wrapper"
          onClick={() => navigate('/inicio_client')}
        >
          <img src="/Logo.png" alt="Logo" />
        </div>

        <ul>
          <li onClick={() => navigate('/inicio_client')}>Inicio</li>
          <li onClick={() => navigate('/productos')}>Piezas</li>
           <li onClick={() => navigate('/pedidos')}>Pedidos</li>
          <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <img
            src="/carrito.png"
            alt="Carrito"
            className="cart-img"
            onClick={() => navigate('/carrito')}
          />
          <img
            src="/perfil.png"
            alt="Perfil"
            className="perfil-img"
            onClick={() => navigate('/perfil')}
          />
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
              <li><strong>Dirección:</strong> Av. Principal #45, Santiago de los Caballeros, R.D.</li>
              <li><strong>Horario:</strong> Lunes a Viernes de 8:00 a.m. - 6:00 p.m.</li>
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

      <style jsx>{`
        .contacto-container {
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
        }

        .sidebar li:hover {
          background-color: #333;
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

        .cart-img,
        .perfil-img {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }

        .perfil-img {
          margin-left: 15px;
          border-radius: 50%;
          object-fit: cover;
        }

        .cart-img:hover,
        .perfil-img:hover {
          filter: brightness(1.2);
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
