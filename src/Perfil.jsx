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
        <div
          className="logo-container"
          onClick={() => navigate('/inicio_client')}
        >
          <div className="logo-circle">
            <img src="/Logo.png" alt="Logo" />
          </div>
        </div>

        <ul>
          <li onClick={() => navigate('/inicio_client')}>Inicio</li>
          <li onClick={() => navigate('/productos')}>Piezas</li>
          <li onClick={() => navigate('/pedidos')}>Pedidos</li>
          <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
          <li onClick={() => navigate('/')}>Cerrar sesión</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="iconos-header">
            <img
              src="/carrito.png"
              alt="Carrito"
              onClick={() => navigate('/carrito')}
            />
            <img
              src="/perfil.png"
              alt="Perfil"
              onClick={() => navigate('/perfil')}
            />
          </div>
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

            <button className="guardar-btn" onClick={handleGuardar}>
              Guardar Cambios
            </button>
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

        .logo-container {
          cursor: pointer;
          text-align: center;
          margin-bottom: 20px;
        }

        .logo-circle {
          background-color: white;
          border-radius: 50%;
          padding: 10px;
          display: inline-block;
        }

        .logo-circle img {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
        }

        .sidebar li {
          margin-bottom: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 5px;
        }

        .sidebar li:hover {
          background-color: #333;
        }

        .icon-img {
          width: 18px;
          height: 18px;
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
