import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './config/axios';
import Swal from 'sweetalert2';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    apellido_usuario: '',
    correo_electronico_usuario: '',
    contrasenia_usuario: '',
    telefono_usuario: '',
    rol: 'cliente' // valor por defecto
  });
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje(null);

    try {
      const response = await axiosInstance.post('/api/auth/register', formData);
      
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'El usuario ha sido registrado correctamente.',
          confirmButtonColor: '#24487f'
        });
        navigate('/login');
      } else {
        throw new Error(response.data.error || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error:', error);
      setTipoMensaje('error');
      setMensaje(error.response?.data?.error || 'Error al registrar el usuario');
      
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Hubo un problema al registrar el usuario.',
        confirmButtonColor: '#24487f'
      });
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
        <div className="register-box">
          <h2>Registro de Usuario</h2>
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
          <form onSubmit={handleSubmit}>
            <div className="user-box">
              <input
                type="text"
                name="nombre_usuario"
                required
                value={formData.nombre_usuario}
                onChange={handleInputChange}
                maxLength="30"
              />
              <label>Nombre</label>
            </div>
            <div className="user-box">
              <input
                type="text"
                name="apellido_usuario"
                required
                value={formData.apellido_usuario}
                onChange={handleInputChange}
                maxLength="30"
              />
              <label>Apellido</label>
            </div>
            <div className="user-box">
              <input
                type="email"
                name="correo_electronico_usuario"
                required
                value={formData.correo_electronico_usuario}
                onChange={handleInputChange}
                maxLength="50"
              />
              <label>Correo Electrónico</label>
            </div>
            <div className="user-box">
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="contrasenia_usuario"
                  required
                  value={formData.contrasenia_usuario}
                  onChange={handleInputChange}
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
            <div className="user-box">
              <input
                type="tel"
                name="telefono_usuario"
                required
                value={formData.telefono_usuario}
                onChange={handleInputChange}
                pattern="[0-9]{12}"
                title="El teléfono debe tener 12 dígitos"
              />
              <label>Teléfono (12 dígitos)</label>
            </div>
            <button 
              type="submit" 
              className="register-button"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar'}
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

        .register-box {
          width: 400px;
          padding: 40px;
          background: rgba(90, 86, 86, 0.36);
          color: white;
          border-radius: 10px;
          box-shadow: 0 15px 25px rgba(0, 0, 0, 0.5);
          text-align: center;
        }

        .register-box h2 {
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

        .register-button {
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

        .register-button:hover {
          background-color: #1a365d;
        }

        .register-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}