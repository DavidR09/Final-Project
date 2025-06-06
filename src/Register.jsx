import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const nuevoUsuario = {
      nombre_usuario: nombre,
      apellido_usuario: apellido,
      correo_electronico_usuario: correo,
      rol_usuario: rol,
      contrasenia_usuario: contrasenia,
      telefono_usuario: telefono,
      fecha_registro_usuario: new Date().toISOString()
    };

    try {
const response = await fetch('http://localhost:3000/api/insertar-usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      setTipoMensaje('success');
      setMensaje('Registro exitoso.');

      // Limpiar campos
      setNombre('');
      setApellido('');
      setCorreo('');
      setRol('');
      setContrasenia('');
      setTelefono('');
    } catch (error) {
      console.error('Error:', error);
      setTipoMensaje('error');
      setMensaje('Hubo un problema al registrar el usuario.');
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
          <li onClick={() => navigate('/inicio')}>Panel de Administración</li>
          <li onClick={() => navigate('/register')}>Registrar Usuario</li>
          <li onClick={() => navigate('/inicio_client')}>Ver Vista Cliente</li>
          <li onClick={() => navigate('/')}>Cerrar sesión</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          
        </header>

        <section className="content">
          <div className="welcome">
            <h1>Registro de Usuario</h1>
          </div>

          <form className="perfil-form" onSubmit={handleRegister}>
            <label>Nombre:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

            <label>Apellido:</label>
            <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} required />

            <label>Correo Electrónico:</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />

            <label>Rol:</label>
            <input type="text" value={rol} onChange={(e) => setRol(e.target.value)} required />

            <label>Contraseña:</label>
            <input type="password" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} required />

            <label>Teléfono:</label>
            <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />

            <button className="guardar-btn" type="submit">Registrarse</button>
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

        .cart-img,
        .perfil-img {
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
        }

        .guardar-btn:hover {
          background-color: #1b3560;
        }
      `}</style>
    </div>
  );
}
