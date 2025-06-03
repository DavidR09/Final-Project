import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({
    nombre_usuario: '',
    apellido_usuario: '',
    correo_electronico_usuario: '',
    telefono_usuario: '',
    fecha_registro_usuario: ''
  });
  const [editando, setEditando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Obtener datos del usuario desde localStorage
  const idUsuario = localStorage.getItem('id_usuario');
  const nombreUsuario = localStorage.getItem('nombre_usuario');

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const token = localStorage.getItem('token');
        setIsLoading(true);
        const response = await axios.get(`http://localhost:3000/api/usuarios/${idUsuario}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        setUsuario(response.data);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setTipoMensaje('error');
        setMensaje('Error al cargar los datos del perfil');
      } finally {
        setIsLoading(false);
      }
    };

    if (idUsuario) {
      cargarDatosUsuario();
    } else {
      navigate('/login');
    }
  }, [idUsuario, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardar = async () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoading(true);
      await axios.put(`http://localhost:3000/api/usuarios/${idUsuario}`, usuario, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      
      // Actualizar localStorage si el nombre cambió
      if (usuario.nombre_usuario !== nombreUsuario) {
        localStorage.setItem('nombre_usuario', usuario.nombre_usuario);
      }
      
      setTipoMensaje('success');
      setMensaje('Cambios guardados correctamente');
      setEditando(false);
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      setTipoMensaje('error');
      setMensaje(error.response?.data?.error || 'Error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCerrarSesion = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('nombre_usuario');
    localStorage.removeItem('rol_usuario');
    
    // Redirigir al login
    navigate('/login');
  };

  return (
    <div className="inicio-container">
      <aside className="sidebar">
        <div
          className="logo-container"
          onClick={() => navigate('/inicio_client')}
        >
          <div className="logo-circle">
            <img src="/Logo.png" alt="Logo" />
          </div>
        </div>

        <ul>
          <li onClick={() => navigate('/inicio_client')}>Inicio</li>
          <li onClick={() => navigate('/carrito')}>
            <img src="/carrito.png" alt="Carrito" className="icon-img" />
            Carrito
          </li>
          <li onClick={handleCerrarSesion}>Cerrar sesión</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <span className="nombre-usuario">
            Hola, {nombreUsuario || 'Usuario'}
          </span>
          <img
            src="/carrito.png"
            alt="Carrito"
            className="cart-img"
            onClick={() => navigate('/carrito')}
          />
          <img
            src="/perfil.png"
            alt="Perfil"
            className="perfil-img"
            onClick={() => navigate('/perfil')}
          />
        </header>

        <section className="content">
          <div className="welcome">
            <h1>Mi Perfil</h1>
            {mensaje && (
              <div className={`mensaje ${tipoMensaje}`}>
                {mensaje}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="loading">Cargando...</div>
          ) : (
            <div className="perfil-info">
              {!editando ? (
                <>
                  <div className="info-item">
                    <label>Nombre:</label>
                    <p>{usuario.nombre_usuario} {usuario.apellido_usuario}</p>
                  </div>
                  
                  <div className="info-item">
                    <label>Correo electrónico:</label>
                    <p>{usuario.correo_electronico_usuario}</p>
                  </div>
                  
                  <div className="info-item">
                    <label>Teléfono:</label>
                    <p>{usuario.telefono_usuario}</p>
                  </div>
                  
                  <div className="info-item">
                    <label>Fecha de registro:</label>
                    <p>{new Date(usuario.fecha_registro_usuario).toLocaleDateString()}</p>
                  </div>
                  
                  <button 
                    className="editar-btn" 
                    onClick={() => setEditando(true)}
                    disabled={isLoading}
                  >
                    Editar Perfil
                  </button>
                </>
              ) : (
                <div className="perfil-form">
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      name="nombre_usuario"
                      value={usuario.nombre_usuario}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Apellido:</label>
                    <input
                      type="text"
                      name="apellido_usuario"
                      value={usuario.apellido_usuario}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Correo electrónico:</label>
                    <input
                      type="email"
                      name="correo_electronico_usuario"
                      value={usuario.correo_electronico_usuario}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Teléfono:</label>
                    <input
                      type="tel"
                      name="telefono_usuario"
                      value={usuario.telefono_usuario}
                      onChange={handleInputChange}
                      maxLength="12"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="botones">
                    <button 
                      className="guardar-btn" 
                      onClick={handleGuardar}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                    
                    <button 
                      className="cancelar-btn" 
                      onClick={() => setEditando(false)}
                      disabled={isLoading}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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

        .logo-container {
          cursor: pointer;
          text-align: center;
          margin-bottom: 20px;
        }

        .logo-circle {
          background-color: white;
          border-radius: 50%;
          padding: 10px;
          display: inline-block;
        }

        .logo-circle img {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
        }

        .sidebar li {
          margin-bottom: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 5px;
        }

        .sidebar li:hover {
          background-color: #333;
        }

        .icon-img {
          width: 18px;
          height: 18px;
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
          gap: 15px;
        }

        .nombre-usuario {
          color: white;
          margin-right: auto;
          padding-left: 20px;
          font-weight: bold;
        }

        .cart-img,
        .perfil-img {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }

        .perfil-img {
          margin-left: 15px;
          border-radius: 50%;
          object-fit: cover;
        }

        .cart-img:hover,
        .perfil-img:hover {
          filter: brightness(1.2);
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
          width: 100%;
        }

        .welcome h1 {
          margin-bottom: 10px;
        }

        .mensaje {
          margin: 15px 0;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          width: 100%;
          max-width: 500px;
        }

        .mensaje.success {
          background-color: rgba(81, 207, 102, 0.1);
          color: #51cf66;
          border: 1px solid #51cf66;
        }

        .mensaje.error {
          background-color: rgba(255, 107, 107, 0.1);
          color: #ff6b6b;
          border: 1px solid #ff6b6b;
        }

        .loading {
          padding: 20px;
          text-align: center;
          font-size: 18px;
          color: #24487f;
        }

        .perfil-info {
          width: 100%;
          max-width: 600px;
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .info-item {
          margin-bottom: 15px;
        }

        .info-item label {
          font-weight: bold;
          display: block;
          margin-bottom: 5px;
          color: #24487f;
        }

        .info-item p {
          margin: 0;
          padding: 8px;
          background: white;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .perfil-form {
          width: 100%;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          font-weight: bold;
          display: block;
          margin-bottom: 5px;
          color: #24487f;
        }

        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .botones {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .editar-btn,
        .guardar-btn,
        .cancelar-btn {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s;
        }

        .editar-btn {
          background-color: #24487f;
          color: white;
        }

        .editar-btn:hover {
          background-color: #1b3560;
        }

        .editar-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .guardar-btn {
          background-color: #28a745;
          color: white;
        }

        .guardar-btn:hover {
          background-color: #218838;
        }

        .guardar-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .cancelar-btn {
          background-color: #dc3545;
          color: white;
        }

        .cancelar-btn:hover {
          background-color: #c82333;
        }

        .cancelar-btn:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}