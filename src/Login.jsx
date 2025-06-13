import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './config/axios';
import { useAuth } from './hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje(null);

    try {
      console.log('Iniciando proceso de login...');
      const response = await axiosInstance.post('/api/auth/login', {
        correo_electronico_usuario: email,
        contrasenia_usuario: password
      });

      console.log('Respuesta de login:', response.data);

      if (response.data && response.data.userId) {
        // Guardar el token JWT en localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        localStorage.setItem('userId', response.data.userId);
        sessionStorage.setItem('userRole', response.data.rol);
        sessionStorage.setItem('isAuthenticated', 'true');
        
        setTipoMensaje('success');
        setMensaje('Inicio de sesión exitoso');

        // Verificar autenticación después del login
        await checkAuth();
        
        // Redirigir basado en el rol
        if (response.data.rol === 'administrador') {
          navigate('/Inicio');
        } else {
          navigate('/Inicio_Client');
        }
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
      
    } catch (error) {
      console.error('Error en login:', error);
      setTipoMensaje('error');
      
      if (error.code === 'ECONNABORTED') {
        setMensaje('El servidor está tardando en responder. Por favor, intente nuevamente.');
      } else {
        setMensaje(error.response?.data?.error || 'Error al iniciar sesión');
      }
      
      // Limpiar datos de autenticación en caso de error
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('isAuthenticated');
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
            <div
              className={`mensaje ${tipoMensaje}`}
              style={{
                color: tipoMensaje === 'error' ? '#ff6b6b' : '#51cf66',
                marginBottom: '15px',
                padding: '10px',
                borderRadius: '5px',
                backgroundColor: tipoMensaje === 'error' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(81, 207, 102, 0.1)'
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
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    fontSize: '20px'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
                <label>Contraseña</label>
              </div>
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

      <style>{`
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
          color: #24487f;
        }

        .user-box {
          position: relative;
          margin-bottom: 30px;
        }

        .user-box input {
          width: 100%;
          padding: 10px 0;
          font-size: 16px;
          color: #333;
          border: none;
          border-bottom: 1px solid #24487f;
          background: transparent;
          outline: none;
        }

        .user-box label {
          position: absolute;
          top: 0;
          left: 0;
          padding: 10px 0;
          font-size: 16px;
          color: #24487f;
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
          color: white;
          background-color: #24487f;
          border: none;
          font-size: 16px;
          cursor: pointer;
          border-radius: 5px;
          transition: 0.3s;
          margin-bottom: 10px;
        }

        .login-button:hover {
          background-color: #1a365d;
        }

        .login-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}