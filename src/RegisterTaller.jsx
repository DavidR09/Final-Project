import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './config/axios';
import Swal from 'sweetalert2';
import { useAuth } from './hooks/useAuth';

export default function RegisterTaller() {
  const navigate = useNavigate();
  const { checkAuth, userRole } = useAuth();
  const [formData, setFormData] = useState({
    nombre_taller: '',
    direccion_taller: '',
    id_usuario: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState('checking'); // 'checking', 'ok', 'not-admin', 'error'
  const [backendRole, setBackendRole] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/check-auth', { withCredentials: true });
        console.log('Respuesta de /api/auth/check-auth:', response.data);
        setBackendRole(response.data.rol);
        if (response.data.rol !== 'administrador') {
          setAuthStatus('not-admin');
        } else {
          setAuthStatus('ok');
        }
      } catch (error) {
        console.error('Error de autenticación:', error);
        setAuthStatus('error');
      }
    };
    verifyAuth();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post('/api/talleres/registrar', {
        ...formData,
        id_usuario: parseInt(formData.id_usuario)
      });
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Taller registrado correctamente',
        confirmButtonColor: '#24487f'
      });
      setFormData({
        nombre_taller: '',
        direccion_taller: '',
        id_usuario: ''
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Error al registrar el taller',
        confirmButtonColor: '#24487f'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render según estado de autenticación
  if (authStatus === 'checking') {
    return <div style={{color: '#24487f', textAlign: 'center', marginTop: '100px'}}>Verificando credenciales...</div>;
  }
  if (authStatus === 'not-admin') {
    return <div style={{color: 'red', textAlign: 'center', marginTop: '100px'}}>No tienes permisos de administrador. Rol detectado: <b>{backendRole}</b></div>;
  }
  if (authStatus === 'error') {
    return <div style={{color: 'red', textAlign: 'center', marginTop: '100px'}}>Error de autenticación. Por favor, inicia sesión nuevamente.</div>;
  }

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
            <h1>Registro de Taller</h1>
          </div>
          <form className="perfil-form" onSubmit={handleSubmit}>
            <label>Nombre del Taller:</label>
            <input
              type="text"
              name="nombre_taller"
              value={formData.nombre_taller}
              onChange={handleChange}
              required
              maxLength="30"
              disabled={isLoading}
            />
            <label>Dirección del Taller:</label>
            <input
              type="text"
              name="direccion_taller"
              value={formData.direccion_taller}
              onChange={handleChange}
              required
              maxLength="70"
              disabled={isLoading}
            />
            <label>ID de Usuario:</label>
            <input
              type="number"
              name="id_usuario"
              value={formData.id_usuario}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <button
              className="guardar-btn"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar Taller'}
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