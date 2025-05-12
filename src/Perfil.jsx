import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleGuardar = () => {
    alert('Cambios guardados correctamente');
  };

  return (
    <div className="inicio-container">
      <aside className="sidebar">
        <h2>Menú</h2>
        <ul>
          <li><a onClick={() => navigate('/inicio')}>Inicio</a></li>
          <li><a onClick={() => navigate('/carrito')}>Carrito</a></li>
          <li><a onClick={() => navigate('/')}>Cerrar sesión</a></li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <img src="/carrito.png" alt="Carrito" className="cart-img" />
        </header>

        <section className="content">
          <div className="welcome">
            <h1>Editar Perfil</h1>
          </div>

          <div className="perfil-form">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />

            <label>Ubicación:</label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Ciudad o país"
            />

            <label>Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Cuéntanos algo sobre ti"
            />

            <button className="guardar-btn" onClick={handleGuardar}>Guardar Cambios</button>
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
          cursor: pointer;
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
          background-color: #24487f;
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
          text-align: center;
        }

        .perfil-form {
          width: 100%;
          max-width: 500px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .perfil-form label {
          font-weight: bold;
          color: #333;
        }

        .perfil-form input,
        .perfil-form textarea {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
          width: 100%;
        }

        .perfil-form textarea {
          resize: vertical;
          min-height: 80px;
        }

        .guardar-btn {
          background-color: #24487f;
          color: white;
          border: none;
          padding: 10px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
        }

        .guardar-btn:hover {
          background-color: #1b3560;
        }
      `}</style>
    </div>
  );
}
