import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterRepuesto() {
  const navigate = useNavigate();
  const [nombre_repuesto, setNombreRepuesto] = useState('');
  const [direccion_repuesto, setDireccionRepuesto] = useState('');
  const [telefono_repuesto, setTelefonoRepuesto] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('');

  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');
    
    // Format the number as XXX-XXX-XXXX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    if (formattedNumber.length <= 12) { // 10 digits + 2 hyphens
      setTelefonoRepuesto(formattedNumber);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const nuevoRepuesto = {
      nombre_repuesto: nombre_repuesto,
      direccion_repuesto: direccion_repuesto,
      telefono_repuesto: telefono_repuesto
    };

    try {
      const response = await fetch('http://localhost:3000/api/repuestos/registrar', {
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
          <li onClick={() => navigate('/admin-pedidos')}>Ver Pedidos Clientes</li>
          <li onClick={() => navigate('/admin-repuestos-piezas')}>Gestionar Repuestos y Piezas</li>
          <li onClick={() => navigate('/admin-usuarios')}>Gestionar Usuarios</li>
          <li onClick={() => navigate('/Inicio_Client')}>Ver Vista Cliente</li>
          <li onClick={() => navigate('/')}>Cerrar sesión</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
        </header>

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
              onChange={handlePhoneChange}
              required 
              maxLength="12"
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              title="El teléfono debe tener el formato: XXX-XXX-XXXX (ejemplo: 809-099-0398)"
              placeholder="809-099-0398"
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