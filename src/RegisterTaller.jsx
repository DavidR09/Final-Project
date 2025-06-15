import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './config/axios';
import Swal from 'sweetalert2';

export default function RegisterTaller() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_taller: '',
    direccion_taller: '',
    id_usuario: ''
  });
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensaje(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay sesión activa');

      await axiosInstance.post(
        '/api/talleres/registrar',
        {
          ...formData,
          id_usuario: parseInt(formData.id_usuario)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'El taller ha sido registrado correctamente.',
        confirmButtonColor: '#24487f'
      });
      setFormData({
        nombre_taller: '',
        direccion_taller: '',
        id_usuario: ''
      });
      setTipoMensaje('success');
      setMensaje('Registro exitoso.');
    } catch (error) {
      console.error('Error:', error);
      setTipoMensaje('error');
      setMensaje(error.response?.data?.error || 'Error al registrar el taller');
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Hubo un problema al registrar el taller.',
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