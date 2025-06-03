import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Neumaticos() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  const neumaticos = [
    { nombre: 'Neumático Goodyear', imagen: '/Neumatico.png' },
    { nombre: 'Neumático Michelin', imagen: '/michelin.png' },
    { nombre: 'Neumático Pirelli', imagen: '/pirelli.png' },
    { nombre: 'Neumático Bridgestone', imagen: '/bridgestone.png' },
  ];

  const neumaticosFiltrados = neumaticos.filter((n) =>
    n.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="productos-container">
      <aside className="sidebar">
        <div className="logo-wrapper" onClick={() => navigate('/inicio_client')}>
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
          <input
            type="text"
            placeholder="Buscar neumático..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscador"
          />
          <div className="iconos-header">
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
          </div>
        </header>

        <section className="content">
          <div className="productos-section">
            <h2>Neumáticos Disponibles</h2>
            <div className="productos-grid">
              {neumaticosFiltrados.map((prod, index) => (
                <div key={index} className="producto-card">
                  <img src={prod.imagen} alt={prod.nombre} />
                  <p>{prod.nombre}</p>
                  <button className="btn-agregar">Agregar</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .productos-container {
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

        .iconos-header {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .cart-img,
        .perfil-img {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }

        .perfil-img {
          border-radius: 50%;
          object-fit: cover;
        }

        .cart-img:hover,
        .perfil-img:hover {
          filter: brightness(1.2);
        }

        .content {
          padding: 20px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-y: auto;
          background-color: #ffffff;
          color: black;
        }

        .productos-section {
          text-align: center;
          width: 100%;
        }

        .productos-section h2 {
          font-size: 28px;
          margin-bottom: 20px;
          color: #333333;
        }

        .productos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 30px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .producto-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 10px;
          transition: transform 0.2s ease;
          background-color: #f9f9f9;
        }

        .producto-card img {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }

        .producto-card p {
          margin-top: 10px;
          font-weight: bold;
          color: black;
        }

        .btn-agregar {
          margin-top: 10px;
          padding: 6px 12px;
          border: none;
          background-color: #24487f;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }

        .btn-agregar:hover {
          background-color: #1a3763;
        }

        .producto-card:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
