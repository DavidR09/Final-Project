import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje(null);

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        correo_electronico_usuario: email,
        contrasenia_usuario: password
      }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data && response.data.userId) {
        setTipoMensaje('success');
        setMensaje('Inicio de sesión exitoso');
        
        // Guardar datos del usuario
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('id_usuario', response.data.userId);
        localStorage.setItem('nombre_usuario', response.data.nombre);
        localStorage.setItem('rol_usuario', response.data.rol);
        
        // Redirigir según el rol
        if (response.data.rol === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/inicio_client');
        }
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (error) {
      console.error('Error:', error);
      setTipoMensaje('error');
      setMensaje(error.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="welcome-container">
      <div className="left-section">
        <img src="/fotinicio.jpg" alt="Dashboard ilustración" />
      </div>
      <div className="right-section">
        <div
          className="logo-container"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src="/Logo.png" alt="Logo" />
        </div>
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          {mensaje && (
            <div className={`mensaje ${tipoMensaje}`}>
              {mensaje}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="user-box">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Correo Electrónico</label>
            </div>
            <div className="user-box">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Contraseña</label>
            </div>
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  const usuario = {
    correo_electronico_usuario: email,
    contrasenia_usuario: password,
  };

  try {
const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });

    const data = await response.json(); // parseamos JSON directamente

    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    setTipoMensaje('success');
    setMensaje(data.message || 'Inicio de sesión exitoso');
    navigate('/inicio');

  } catch (error) {
    console.error('Error:', error);
    setTipoMensaje('error');
    setMensaje(error.message || 'Hubo un problema al iniciar sesión.');
  }
};



  return (
    <div className="welcome-container">
      <div className="left-section">
        <img src="/public/fotinicio.jpg" alt="Dashboard ilustración" />
      </div>
      <div className="right-section">
        <div
          className="logo-container"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src="/public/Logo.png" alt="Logo" />
        </div>
        <div className="login-box">
          <h2>Iniciar Sesión</h2>
          {mensaje && (
            <div
              className={`mensaje ${tipoMensaje}`}
              style={{
                color: tipoMensaje === 'error' ? 'red' : 'green',
                marginBottom: '15px',
              }}
            >
              {mensaje}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="user-box">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Correo Electrónico</label>
            </div>
            <div className="user-box">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Contraseña</label>
            </div>
            <button type="submit" className="login-button">Iniciar Sesión</button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .welcome-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .left-section {
          flex: 1;
          background-color: #2a2829;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .left-section img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .right-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: white;
          padding: 20px;
        }

        .logo-container {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .logo-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .login-box {
          width: 400px;
          padding: 40px;
          background: rgba(90, 86, 86, 0.36);
          color: white;
          border-radius: 10px;
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
          text-align: center;
        }

        .login-box h2 {
          margin-bottom: 30px;
        }

        .user-box {
          position: relative;
          margin-bottom: 30px;
        }

        .user-box input {
          width: 100%;
          padding: 10px 0;
          font-size: 16px;
          color: #fff;
          border: none;
          border-bottom: 1px solid #fff;
          background: transparent;
          outline: none;
        }

        .user-box label {
          position: absolute;
          top: 0;
          left: 0;
          padding: 10px 0;
          font-size: 16px;
          color: #fff;
          pointer-events: none;
          transition: 0.5s;
        }

        .user-box input:focus ~ label,
        .user-box input:valid ~ label {
          top: -20px;
          color: #24487f;
          font-size: 12px;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          color: #24487f;
          background: none;
          border: 1px solid #24487f;
          font-size: 16px;
          cursor: pointer;
          border-radius: 5px;
          transition: 0.5s;
          margin-bottom: 10px;
        }

        .login-button:hover {
          background-color: #24487f;
          color: #fff;
        }

        .mensaje {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
} */