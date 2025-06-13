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
        <section className="content">
          <div className="welcome">
            <h1>Registro de Usuario</h1>
          </div>

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

          <form className="perfil-form" onSubmit={handleSubmit}>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              maxLength="30"
            />

            <label>Apellido:</label>
            <input
              type="text"
              name="apellido_usuario"
              value={formData.apellido_usuario}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              maxLength="30"
            />

            <label>Correo Electrónico:</label>
            <input
              type="email"
              name="correo_electronico_usuario"
              value={formData.correo_electronico_usuario}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              maxLength="50"
            />

            <label>Contraseña:</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="contrasenia_usuario"
                value={formData.contrasenia_usuario}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? '👁️' : '🙈'}
              </span>
            </div>

            <label>Rol:</label>
            <input
              type="rol"
              name="rol_usuario"
              value={formData.rol_usuario}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <label>Teléfono:</label>
            <input
              type="tel"
              name="telefono_usuario"
              value={formData.telefono_usuario}
              onChange={handleInputChange}
              required
              pattern="[0-9]{12}"
              title="El teléfono debe tener 12 dígitos"
              disabled={isLoading}
            />

            <button 
              type="submit" 
              className="guardar-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar Usuario'}
            </button>
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
          box-sizing: border-box;
        }

        .perfil-form input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .password-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 18px;
          user-select: none;
          background: white;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .password-toggle:hover {
          background-color: #f0f0f0;
          border-radius: 3px;
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
          transition: background-color 0.3s ease;
        }

        .guardar-btn:hover:not(:disabled) {
          background-color: #1a365d;
        }

        .guardar-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}