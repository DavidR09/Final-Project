import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ Estado para mostrar/ocultar
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

            <div className="user-box password-box">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Contraseña</label>
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
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

        .password-box .toggle-password {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: #ccc;
          cursor: pointer;
          font-size: 18px;
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

        .register-link {
          margin-top: 10px;
          font-size: 14px;
          color: #ccc;
        }

        .register-link a {
          color: #24487f;
          text-decoration: none;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
