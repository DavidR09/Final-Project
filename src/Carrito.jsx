import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Carrito() {
  const navigate = useNavigate();

  return (
    <div className="carrito-container">
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
          <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
          <li onClick={() => navigate('/pedidos')}>Pedidos</li>
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

        <section className="carrito-section">
          <table className="carrito-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {/* Sin productos aún */}
            </tbody>
          </table>

          <div className="detalle-compra">
            <h3 className="detalle-title">Resumen de Compra</h3>
            <p className="total">Total: $0</p>
            <button className="confirmar-btn" disabled>Confirmar Pedido</button>
            <p className="vuelva">Vuelva pronto 😄</p>
          </div>
        </section>
      </main>

      <style jsx>{`
        .carrito-container {
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

        .carrito-section {
          display: flex;
          padding: 20px;
          gap: 30px;
          background-color: #ffffff;
          color: black;
        }

        .carrito-table {
          flex: 3;
          width: 100%;
          border-collapse: collapse;
          background-color: #f5f5f5;
        }

        .carrito-table thead {
          background-color: #24487f;
          color: white;
        }

        .carrito-table th,
        .carrito-table td {
          padding: 15px;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }

        .detalle-compra {
          flex: 1;
          border: 1px solid #ddd;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
          text-align: center;
        }

        .detalle-title {
          color: #24487f;
          margin-bottom: 10px;
        }

        .total {
          font-size: 24px;
          margin: 10px 0;
        }

        .confirmar-btn {
          background-color: #24487f;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          border-radius: 6px;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .vuelva {
          margin-top: 20px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
