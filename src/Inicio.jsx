import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inicio() {
  const navigate = useNavigate();

  const categorias = [
    { nombre: 'Neumáticos', imagen: '/public/Neumatico.png', ruta: 'neumaticos' },
    { nombre: 'Baterías De Carro', imagen: '/public/bateria.jpg', ruta: 'baterias' },
    { nombre: 'Faroles y Pantallas', imagen: '/public/pantallasmicas.png', ruta: 'faroles' },
    { nombre: 'Aros', imagen: '/public/aros.png', ruta: 'aros' },
    { nombre: 'Gatos', imagen: '/public/gato.png', ruta: 'gatos' },
    { nombre: 'Lubricantes', imagen: '/public/lubricante.png', ruta: 'lubricantes' },
    { nombre: 'Carrocerías', imagen: '/public/carroceria.png', ruta: 'carrocerias' },
    { nombre: 'Eléctricos', imagen: '/public/electricas.png', ruta: 'electricos' },
    { nombre: 'Amortiguadores', imagen: '/public/amortiguadores.png', ruta: 'amortiguadores' },
    { nombre: 'Filtros De aceite', imagen: '/public/filtros.png', ruta: 'filtros' },
  ];

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
          <div className="repuestos-section">
            <h2>Repuestos</h2>
            <div className="categorias-grid">
              {categorias.map((cat) => (
                <div
                  key={cat.nombre}
                  className="categoria-card"
                  onClick={() => navigate(`/repuestos/${cat.ruta}`)}
                >
                  <img src={cat.imagen} alt={cat.nombre} />
                  <p>{cat.nombre}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
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
          align-items: center;
          padding: 20px;
          background-color: #24487f;
        }

        .cart-img {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }

        .perfil-img {
          width: 30px;
          height: 30px;
          margin-left: 15px;
          cursor: pointer;
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

        .welcome {
          margin-bottom: 30px;
        }

        .repuestos-section {
          text-align: center;
          width: 100%;
        }

        .repuestos-section h2 {
          font-size: 28px;
          margin-bottom: 20px;
          color: #333333;
        }

        .categorias-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 30px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .categoria-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .categoria-card img {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }

        .categoria-card p {
          margin-top: 10px;
          font-weight: bold;
          text-align: center;
          color: black;
        }

        .categoria-card:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
