import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminUsuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('https://backend-respuestosgra.up.railway.app/api/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter(usuario => {
    const cumpleFiltroTexto = 
      usuario.nombre_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellido_usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.correo_electronico_usuario.toLowerCase().includes(busqueda.toLowerCase());

    const cumpleFiltroRol = filtroRol === 'todos' || usuario.rol_usuario === filtroRol;

    return cumpleFiltroTexto && cumpleFiltroRol;
  });

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
            <h1>Gestión de Usuarios</h1>
          </div>

          <div className="filtros">
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="buscador"
            />
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              className="selector-rol"
            >
              <option value="todos">Todos los roles</option>
              <option value="administrador">Administradores</option>
              <option value="usuario">Usuarios</option>
            </select>
          </div>

          {isLoading ? (
            <div className="loading">Cargando...</div>
          ) : (
            <div className="usuarios-container">
              {usuariosFiltrados.length === 0 ? (
                <div className="no-resultados">
                  <p>No se encontraron usuarios que coincidan con la búsqueda</p>
                </div>
              ) : (
                <div className="tabla-container">
                  <table className="usuarios-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Rol</th>
                        <th>Fecha Registro</th>
                        <th>Taller</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((usuario) => (
                        <tr key={usuario.id_usuario}>
                          <td>{usuario.id_usuario}</td>
                          <td>{`${usuario.nombre_usuario} ${usuario.apellido_usuario}`}</td>
                          <td>{usuario.correo_electronico_usuario}</td>
                          <td>{usuario.telefono_usuario}</td>
                          <td>
                            <span className={`rol-badge ${usuario.rol_usuario}`}>
                              {usuario.rol_usuario}
                            </span>
                          </td>
                          <td>{new Date(usuario.fecha_registro_usuario).toLocaleDateString()}</td>
                          <td>
                            {usuario.nombre_taller ? (
                              <div>
                                <div>{usuario.nombre_taller}</div>
                                <small>{usuario.direccion_taller}</small>
                              </div>
                            ) : (
                              <span className="no-taller">Sin taller</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <style>{`
        .inicio-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
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
        }

        .sidebar li:hover {
          background-color: #333;
        }

        .main-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .welcome {
          margin-bottom: 30px;
          text-align: center;
        }

        .welcome h1 {
          color: #24487f;
          font-size: 24px;
        }

        .filtros {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }

        .buscador {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }

        .selector-rol {
          padding: 10px 15px;
          border: 2px solid #24487f;
          border-radius: 5px;
          font-size: 16px;
          min-width: 180px;
          background-color: white;
          color: #24487f;
          cursor: pointer;
          transition: all 0.3s ease;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2324487f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 1em;
        }

        .selector-rol:hover, .selector-rol:focus {
          border-color: #1a365d;
          outline: none;
          box-shadow: 0 0 0 2px rgba(36, 72, 127, 0.2);
        }

        .selector-rol option {
          padding: 10px;
        }

        .usuarios-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .tabla-container {
          max-height: calc(100vh - 250px);
          overflow-y: auto;
          border-radius: 8px;
        }

        .usuarios-table {
          width: 100%;
          border-collapse: collapse;
        }

        .usuarios-table thead {
          position: sticky;
          top: 0;
          background-color: #f5f5f5;
          z-index: 1;
        }

        .usuarios-table th,
        .usuarios-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .usuarios-table th {
          font-weight: 600;
        }

        .rol-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .rol-badge.administrador {
          background-color: #ffd700;
          color: #000;
        }

        .rol-badge.usuario {
          background-color: #90caf9;
          color: #000;
        }

        .no-taller {
          color: #999;
          font-style: italic;
        }

        .loading {
          text-align: center;
          padding: 20px;
          font-size: 18px;
          color: #666;
        }

        .no-resultados {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 16px;
          background-color: #f9f9f9;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
} 