import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import './styles/global.css';
import HeaderIcons from './components/HeaderIcons';

// Configurar axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function Perfil() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    apellido_usuario: '',
    correo_electronico_usuario: '',
    contrasenia_usuario: '',
    telefono_usuario: ''
  });
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Verificar autenticación y rol
        const authResponse = await axiosInstance.get('/api/auth/check-auth');
        setUserRole(authResponse.data.rol);

        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('Usuario no autenticado');
        }

        // Cargar datos del usuario
        const userResponse = await axiosInstance.get(`/api/auth/usuario/${userId}`);
        
        if (userResponse.data && userResponse.data.usuario) {
          setFormData({
            nombre_usuario: userResponse.data.usuario.nombre_usuario || '',
            apellido_usuario: userResponse.data.usuario.apellido_usuario || '',
            correo_electronico_usuario: userResponse.data.usuario.correo_electronico_usuario || '',
            contrasenia_usuario: '',
            telefono_usuario: userResponse.data.usuario.telefono_usuario || ''
          });
        } else {
          throw new Error('Datos de usuario no encontrados o en formato incorrecto');
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        
        if (error.response?.status === 401) {
          navigate('/login');
          return;
        }

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudieron cargar los datos del usuario',
          confirmButtonColor: '#24487f'
        });
      }
    };

    loadUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.nombre_usuario.length > 30 || formData.apellido_usuario.length > 30) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre y apellido no pueden exceder 30 caracteres',
        confirmButtonColor: '#24487f'
      });
      return;
    }

    if (formData.correo_electronico_usuario.length > 50) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El correo no puede exceder 50 caracteres',
        confirmButtonColor: '#24487f'
      });
      return;
    }

    if (formData.telefono_usuario && formData.telefono_usuario.length !== 12) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El teléfono debe tener exactamente 12 caracteres',
        confirmButtonColor: '#24487f'
      });
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      const response = await axiosInstance.put(`/api/auth/usuario/${userId}`, formData);
      
      if (response.data.success) {
        await Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Perfil actualizado correctamente',
          confirmButtonColor: '#24487f'
        });
      } else {
        throw new Error(response.data.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || error.message || 'No se pudo actualizar el perfil',
        confirmButtonColor: '#24487f'
      });
    }
  };

  return (
    <div className="inicio-container">
      <div className="sidebar">
        <div className="logo-wrapper" onClick={() => navigate('/inicio_client')}>
          <img src="/Logo.png" alt="Logo" />
        </div>
        <ul>
          <li onClick={() => navigate('/inicio_client')}>Inicio</li>
          <li onClick={() => navigate('/productos')}>Piezas</li>
          <li onClick={() => navigate('/pedidos')}>Pedidos</li>
          <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
          {userRole === 'administrador' && (
            <li onClick={() => navigate('/Inicio')}>Volver al Panel Admin</li>
          )}
          <li onClick={async () => {
            try {
              await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, {
                withCredentials: true
              });
              localStorage.removeItem('userId');
              navigate('/');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              navigate('/');
            }
          }}>Cerrar Sesión</li>
        </ul>
      </div>

      <main className="main-content">
        <header className="header">
          <div className="iconos-header">
            <HeaderIcons />
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <h1>Mi Perfil</h1>
          </div>

          <form className="perfil-form" onSubmit={handleSubmit}>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleInputChange}
              required
            />

            <label>Apellido:</label>
            <input
              type="text"
              name="apellido_usuario"
              value={formData.apellido_usuario}
              onChange={handleInputChange}
              required
            />

            <label>Correo Electrónico:</label>
            <input
              type="email"
              name="correo_electronico_usuario"
              value={formData.correo_electronico_usuario}
              onChange={handleInputChange}
              required
            />

            <label>Contraseña:</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="contrasenia_usuario"
                value={formData.contrasenia_usuario}
                onChange={handleInputChange}
                placeholder="Dejar en blanco para mantener la contraseña actual"
                className="password-input"
              />
              <span 
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? '👁️' : '🙈'}
              </span>
            </div>

            <label>Teléfono:</label>
            <input
              type="tel"
              name="telefono_usuario"
              value={formData.telefono_usuario}
              onChange={handleInputChange}
              required
            />

            <button className="guardar-btn" type="submit">Guardar Cambios</button>
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

        .header {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 20px;
          background-color: #24487f;
        }

        .iconos-header {
          display: flex;
          gap: 20px;
        }

        .iconos-header img {
          width: 30px;
          height: 30px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .iconos-header img:hover {
          transform: scale(1.1);
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

        .perfil-form input:focus {
          outline: none;
          border-color: #24487f;
          box-shadow: 0 0 5px rgba(36, 72, 127, 0.2);
        }

        .password-container {
          position: relative;
          width: 100%;
        }

        .password-input {
          padding: 10px 40px 10px 10px !important;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
          width: 100%;
          box-sizing: border-box;
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
          padding: 12px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 20px;
          width: 100%;
          box-sizing: border-box;
        }

        .guardar-btn:hover {
          background-color: #1b3560;
        }

        .readonly-input {
          border-color: #24487f;
          box-shadow: 0 0 5px rgba(36, 72, 127, 0.2);
        }

        .email-note {
          font-size: 1em;
          color: #666;
        }
      `}</style>
    </div>
  );
}