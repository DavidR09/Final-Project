import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', { email, password });
    navigate('/inicio'); // Redirige a la página de inicio
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

          <p className="register-link">
            ¿No tienes una cuenta? <a href="/register">Regístrate</a>
          </p>
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
          background: rgba(0, 0, 0, 0.6);
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
          color: #03e9f4;
          font-size: 12px;
        }

        .login-button {
          width: 100%;
          padding: 12px;
          color: #03e9f4;
          background: none;
          border: 1px solid #03e9f4;
          font-size: 16px;
          cursor: pointer;
          border-radius: 5px;
          transition: 0.5s;
          margin-bottom: 10px;
        }

        .login-button:hover {
          background-color: #03e9f4;
          color: #fff;
        }

        .register-link {
          margin-top: 10px;
          font-size: 14px;
          color: #ccc;
        }

        .register-link a {
          color: #03e9f4;
          text-decoration: none;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
