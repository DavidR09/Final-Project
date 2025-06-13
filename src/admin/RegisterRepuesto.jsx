import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterRepuesto() {
  const navigate = useNavigate();
  const [nombre_repuesto, setNombreRepuesto] = useState('');
  const [direccion_repuesto, setDireccionRepuesto] = useState('');
  const [telefono_repuesto, setTelefonoRepuesto] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const nuevoRepuesto = {
      nombre_repuesto: nombre_repuesto,
      direccion_repuesto: direccion_repuesto,
      telefono_repuesto: telefono_repuesto
    };

    try {
      const response = await fetch('https://backend-respuestosgra.up.railway.app/api/insertar-repuesto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoRepuesto)
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      setTipoMensaje('success');
      setMensaje('Registro exitoso.');

      // Limpiar campos
      setNombreRepuesto('');
      setDireccionRepuesto('');
      setTelefonoRepuesto('');
    } catch (error) {
      console.error('Error:', error);
      setTipoMensaje('error');
      setMensaje('Hubo un problema al registrar el repuesto.');
    }
  };

  return (
    <div className="inicio-container">
      <aside className="sidebar">
        <div className="logo-wrapper" onClick={() => navigate('/inicio')}>
          <img src="/Logo.png" alt="Logo" />
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
        <section className="content">
          <div className="welcome">
            <h1>Registro de Repuesto</h1>
          </div>

          <form className="perfil-form" onSubmit={handleRegister}>
            <label>Nombre del Repuesto:</label>
            <input 
              type="text" 
              value={nombre_repuesto} 
              onChange={(e) => setNombreRepuesto(e.target.value)} 
              required 
              maxLength="50"
            />

            <label>Dirección del Repuesto:</label>
            <input 
              type="text" 
              value={direccion_repuesto} 
              onChange={(e) => setDireccionRepuesto(e.target.value)} 
              required 
              maxLength="70"
            />

            <label>Teléfono del Repuesto:</label>
            <input 
              type="tel" 
              value={telefono_repuesto} 
              onChange={(e) => setTelefonoRepuesto(e.target.value)} 
              required 
              maxLength="12"
              pattern="[0-9]{12}"
              title="El teléfono debe tener 12 dígitos"
            />

            <button className="guardar-btn" type="submit">Registrar Repuesto</button>
            {mensaje && (
              <p style={{ color: tipoMensaje === 'error' ? 'red' : 'green', marginTop: '10px', textAlign: 'center' }}>
                {mensaje}
              </p>
            )}
          </form>
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