import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inicio() {
  const navigate = useNavigate();

  return (
    <div className="inicio-container">
      <aside className="sidebar">
        <h2>Menú</h2>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Productos</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <img
            src="/carrito.png"  // No uses /public en la ruta; solo "/carrito.png" si está en /public
            alt="Carrito"
            className="cart-img"
            onClick={() => navigate('/carrito')}
          />
        </header>
        <section className="content">
          <h1>Bienvenido a la página inicial</h1>
        </section>
      </main>

      <style jsx>{`
        .inicio-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          background-color:rgb(255, 255, 255); 
        }

        .sidebar {
          width: 250px;
          background-color: #2a2829;
          color: white;
          padding: 20px;
        }

        .sidebar h2 {
          margin-bottom: 20px;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
        }

        .sidebar li {
          margin-bottom: 10px;
        }

        .sidebar a {
          color: white;
          text-decoration: none;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: flex-end;
          padding: 20px;
          background-color:hsl(0, 0.00%, 16.90%);
        }

        .cart-img {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }

        .cart-img:hover {
          filter: brightness(1.2);
        }

        .content {
          padding: 40px;
        }
      `}</style>
    </div>
  );
}
