import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
//import './Perfil.css';

export default function Perfil() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    apellido_usuario: '',
    correo_electronico_usuario: '',
    contrasenia_usuario: '',
    telefono_usuario: ''
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    fetch(`http://localhost:3000/api/auth/usuario/${userId}`, {
      credentials: 'include' // Incluir cookies en la petición
    })
      .then(async res => {
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('La respuesta del servidor no es JSON válido');
        }

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || 'Error al obtener los datos del usuario');
        }
        
        return data;
      })
      .then(data => {
        console.log('Datos recibidos del servidor:', data);
        
        if (data && data.usuario) {
          setFormData({
            nombre_usuario: data.usuario.nombre_usuario || '',
            apellido_usuario: data.usuario.apellido_usuario || '',
            correo_electronico_usuario: data.usuario.correo_electronico_usuario || '',
            contrasenia_usuario: '', // No mostrar la contraseña actual
            telefono_usuario: data.usuario.telefono_usuario || ''
          });
        } else {
          console.error('Estructura de datos inesperada:', data);
          throw new Error('Datos de usuario no encontrados o en formato incorrecto');
        }
      })
      .catch(error => {
        console.error('Error detallado al cargar datos del usuario:', {
          message: error.message,
          stack: error.stack
        });
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudieron cargar los datos del usuario',
          confirmButtonColor: '#24487f'
        });
      });
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
      const response = await fetch(`http://localhost:3000/api/auth/usuario/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Perfil actualizado correctamente',
          confirmButtonColor: '#24487f'
        });
      } else {
        throw new Error(data.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo actualizar el perfil',
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
          <li onClick={() => navigate('/')}>Cerrar Sesión</li>
        </ul>
      </div>

      <main className="main-content">
        <header className="header">
          <div className="iconos-header">
            <img
              src="/carrito.png"
              alt="Carrito"
              onClick={() => navigate('/carrito')}
            />
            <img
              src="/perfil.png"
              alt="Perfil"
              onClick={() => navigate('/perfil')}
            />
          </div>
        </header>

        <section className="content">
          <div className="welcome">
            <h1>Editar Perfil</h1>
          </div>

          <form className="perfil-form" onSubmit={handleSubmit}>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleInputChange}
              placeholder="Tu nombre"
              maxLength={30}
              required
            />

            <label>Apellido:</label>
            <input
              type="text"
              name="apellido_usuario"
              value={formData.apellido_usuario}
              onChange={handleInputChange}
              placeholder="Tu apellido"
              maxLength={30}
              required
            />

            <label>Correo electrónico:</label>
            <input
              type="email"
              name="correo_electronico_usuario"
              value={formData.correo_electronico_usuario}
              onChange={handleInputChange}
              placeholder="tu@correo.com"
              maxLength={50}
              required
            />

            <label>Nueva contraseña:</label>
            <input
              type="password"
              name="contrasenia_usuario"
              value={formData.contrasenia_usuario}
              onChange={handleInputChange}
              placeholder="Nueva contraseña"
              maxLength={100}
            />

            <label>Teléfono:</label>
            <input
              type="tel"
              name="telefono_usuario"
              value={formData.telefono_usuario}
              onChange={handleInputChange}
              placeholder="XXX-XXX-XXXX"
              maxLength={12}
              required
            />

            <button type="submit" className="guardar-btn">
              Guardar Cambios
            </button>
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
          cursor: pointer;
          text-align: center;
          margin-bottom: 20px;
        }

        .logo-wrapper img {
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
        }

        .perfil-form input:focus {
          outline: none;
          border-color: #24487f;
          box-shadow: 0 0 5px rgba(36, 72, 127, 0.2);
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
        }

        .guardar-btn:hover {
          background-color: #1b3560;
        }
      `}</style>
    </div>
  );
}
