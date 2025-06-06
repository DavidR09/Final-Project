import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Pedidos() {
  const navigate = useNavigate();

  return (
    <div className="pedidos-container">
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
          <div className="pedidos-section">
            <h2>Pedidos</h2>
            <p>Aquí se mostrará el historial de pedidos del cliente.</p>
            {/* Puedes agregar más elementos aquí, como tablas, filtros, etc. */}
          </div>
        </section>
      </main>

      <style jsx>{`
        .pedidos-container {
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

        .pedidos-section {
          max-width: 700px;
          width: 100%;
          color: #333;
        }

        .pedidos-section h2 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .pedidos-section p {
          font-size: 16px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
