import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

// Configurar axios para incluir credenciales en todas las solicitudes
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const axiosInstance = axios.create({
  baseURL: 'https://backend-respuestosgra.up.railway.app/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default function RegisterTaller() {
  const navigate = useNavigate();
  const [nombre_taller, setNombreTaller] = useState('');
  const [direccion_taller, setDireccionTaller] = useState('');
  const [id_usuario, setIdUsuario] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/check-auth');
        if (response.data.rol !== 'administrador') {
          throw new Error('No tienes permisos de administrador');
        }
      } catch (error) {
        console.error('Error de autenticación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: 'Por favor, inicia sesión como administrador',
          confirmButtonColor: '#24487f'
        }).then(() => {
          navigate('/login');
        });
      }
    };

    checkAuth();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const nuevoTaller = {
      nombre_taller: nombre_taller,
      direccion_taller: direccion_taller,
      id_usuario: parseInt(id_usuario)
    };

    try {
      const response = await axiosInstance.post('/api/talleres/registrar', nuevoTaller);

      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'El taller ha sido registrado correctamente.',
        confirmButtonColor: '#24487f'
      });

      // Limpiar campos
      setNombreTaller('');
      setDireccionTaller('');
      setIdUsuario('');
    } catch (error) {
      console.error('Error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || error.message || 'Hubo un problema al registrar el taller.',
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
            <h1>Registro de Taller</h1>
          </div>

          <form className="perfil-form" onSubmit={handleRegister}>
            <label>Nombre del Taller:</label>
            <input 
              type="text" 
              value={nombre_taller} 
              onChange={(e) => setNombreTaller(e.target.value)} 
              required 
              maxLength="30"
              disabled={isLoading}
            />

            <label>Dirección del Taller:</label>
            <input 
              type="text" 
              value={direccion_taller} 
              onChange={(e) => setDireccionTaller(e.target.value)} 
              required 
              maxLength="70"
              disabled={isLoading}
            />

            <label>ID de Usuario:</label>
            <input 
              type="number" 
              value={id_usuario} 
              onChange={(e) => setIdUsuario(e.target.value)} 
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