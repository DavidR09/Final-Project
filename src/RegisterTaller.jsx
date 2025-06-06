import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterTaller() {
  const navigate = useNavigate();
  const [nombre_taller, setNombreTaller] = useState('');
  const [direccion_taller, setDireccionTaller] = useState('');
  const [id_usuario, setIdUsuario] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const nuevoTaller = {
      nombre_taller: nombre_taller,
      direccion_taller: direccion_taller,
      id_usuario: id_usuario
    };

    try {
      const response = await fetch('http://localhost:3000/api/talleres/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoTaller)
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      setTipoMensaje('success');
      setMensaje('Registro exitoso.');

      // Limpiar campos
      setNombreTaller('');
      setDireccionTaller('');
      setIdUsuario('');
    } catch (error) {
      console.error('Error:', error);
      setTipoMensaje('error');
      setMensaje('Hubo un problema al registrar el taller.');
    }
  };

  return (
    <div className="inicio-container">
      <aside className="sidebar">
        <div className="logo-container" onClick={() => navigate('/inicio')}>
          <div className="logo-circle">
            <img src="/Logo.png" alt="Logo" />
          </div>
        </div>
        <ul>
          <li onClick={() => navigate('/Inicio')}>Panel de Administración</li>
          <li onClick={() => navigate('/register')}>Registrar Usuario</li>
          <li onClick={() => navigate('/register-taller')}>Registrar Taller</li>
          <li onClick={() => navigate('/register-repuesto')}>Registrar Repuesto</li>
          <li onClick={() => navigate('/Inicio_Client')}>Ver Vista Cliente</li>
          <li onClick={() => navigate('/')}>Cerrar sesión</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
        </header>

        <section className="content">
          <div className="welcome">
            <h1>Registro de Taller</h1>
          </div>

          <form className="perfil-form" onSubmit={handleRegister}>
            <label>Nombre del Taller:</label>
            <input 
              type="text" 
              value={nombre_taller} 
              onChange={(e) => setNombreTaller(e.target.value)} 
              required 
              maxLength="30"
            />

            <label>Dirección del Taller:</label>
            <input 
              type="text" 
              value={direccion_taller} 
              onChange={(e) => setDireccionTaller(e.target.value)} 
              required 
              maxLength="70"
            />

            <label>ID de Usuario:</label>
            <input 
              type="text" 
              value={id_usuario} 
              onChange={(e) => setIdUsuario(e.target.value)} 
              required 
            />

            <button className="guardar-btn" type="submit">Registrar Taller</button>
            {mensaje && (
              <p style={{ color: tipoMensaje === 'error' ? 'red' : 'green', marginTop: '10px', textAlign: 'center' }}>
                {mensaje}
              </p>
            )}
          </form>
        </section>
      </main>

      <style>{`
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

        .perfil-form input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
          width: 100%;
        }

        .guardar-btn {
          background-color: #24487f;
          color: white;
          border: none;
          padding: 10px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
        }

        .guardar-btn:hover {
          background-color: #1a365d;
        }
      `}</style>
    </div>
  );
} 