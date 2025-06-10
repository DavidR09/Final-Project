import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const nuevoUsuario = {
      nombre_usuario: nombre,
      apellido_usuario: apellido,
      correo_electronico_usuario: correo,
      rol_usuario: rol,
      contrasenia_usuario: contrasenia,
      telefono_usuario: telefono,
      fecha_registro_usuario: new Date().toISOString()
    };

    try {
      const response = await axios.post('http://localhost:3000/api/usuarios/insertar-usuario', nuevoUsuario, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Respuesta del servidor:', response.data);

      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'El usuario ha sido registrado correctamente.',
        confirmButtonColor: '#24487f'
      });

      // Limpiar campos
      setNombre('');
      setApellido('');
      setCorreo('');
      setRol('');
      setContrasenia('');
      setTelefono('');
    } catch (error) {
      console.error('Error:', error);
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

          <form className="perfil-form" onSubmit={handleRegister}>
            <label>Nombre:</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              required 
              disabled={isLoading}
            />

            <label>Apellido:</label>
            <input 
              type="text" 
              value={apellido} 
              onChange={(e) => setApellido(e.target.value)} 
              required 
              disabled={isLoading}
            />

            <label>Correo Electrónico:</label>
            <input 
              type="email" 
              value={correo} 
              onChange={(e) => setCorreo(e.target.value)} 
              required 
              disabled={isLoading}
            />

            <label>Rol:</label>
            <select 
              value={rol} 
              onChange={(e) => setRol(e.target.value)} 
              required 
              disabled={isLoading}
            >
              <option value="">Seleccione un rol</option>
              <option value="administrador">Administrador</option>
              <option value="usuario">Usuario</option>
            </select>

            <label>Contraseña:</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                required
                disabled={isLoading}
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
            </div>

            <label>Teléfono:</label>
            <input 
              type="tel" 
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
              required 
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
              placeholder="123-456-7890"
              disabled={isLoading}
            />

            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar Usuario'}
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
        }

        .cart-img,
        .perfil-img {
          width: 30px;
          height: 30px;
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

        .guardar-btn {
          background-color:rgb(34, 94, 184);
          color: white;
          border: none;
          padding: 10px;
          font-size: 16px;
          border-radius: 5px;
          cursor: pointer;
        }

        .guardar-btn:hover {
          background-color:rgb(23, 82, 177);
        }
      `}</style>
    </div>
  );
}
