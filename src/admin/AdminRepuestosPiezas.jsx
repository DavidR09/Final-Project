import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminRepuestosPiezas() {
  const navigate = useNavigate();
  const [repuestos, setRepuestos] = useState([]);
  const [expandedRepuesto, setExpandedRepuesto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRepuestos = async () => {
      try {
        const response = await axios.get('https://backend-respuestosgra.up.railway.app/api/repuestos/con-piezas');
        setRepuestos(response.data);
      } catch (error) {
        console.error('Error al obtener repuestos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepuestos();
  }, []);

  const toggleRepuesto = (id) => {
    setExpandedRepuesto(expandedRepuesto === id ? null : id);
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
            <h1>Gestión de Repuestos y Piezas</h1>
          </div>

          {isLoading ? (
            <div className="loading">Cargando...</div>
          ) : (
            <div className="repuestos-container">
              {repuestos.map((repuesto) => (
                <div key={repuesto.id_repuesto} className="repuesto-card">
                  <div 
                    className="repuesto-header"
                    onClick={() => toggleRepuesto(repuesto.id_repuesto)}
                  >
                    <h2>{repuesto.nombre_repuesto}</h2>
                    <span className="toggle-icon">
                      {expandedRepuesto === repuesto.id_repuesto ? '▼' : '▶'}
                    </span>
                  </div>

                  {expandedRepuesto === repuesto.id_repuesto && (
                    <div className="piezas-container">
                      <table className="piezas-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Años</th>
                          </tr>
                        </thead>
                        <tbody>
                          {repuesto.piezas.map((pieza) => (
                            <tr key={pieza.id_repuesto}>
                              <td>{pieza.id_repuesto}</td>
                              <td>
                                <img 
                                  src={pieza.imagen_pieza} 
                                  alt={pieza.nombre_pieza}
                                  className="pieza-imagen"
                                />
                              </td>
                              <td>{pieza.nombre_pieza}</td>
                              <td>{pieza.nombre_categoria_pieza}</td>
                              <td>RD$ {parseFloat(pieza.precio_pieza).toFixed(2)}</td>
                              <td>{pieza.cantidad_pieza}</td>
                              <td>{pieza.desde_anio_pieza} - {pieza.hasta_anio_pieza}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
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

        .repuestos-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .repuesto-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .repuesto-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background-color: #24487f;
          color: white;
          cursor: pointer;
        }

        .repuesto-header h2 {
          margin: 0;
          font-size: 18px;
        }

        .toggle-icon {
          font-size: 20px;
        }

        .piezas-container {
          padding: 20px;
        }

        .piezas-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .piezas-table th,
        .piezas-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .piezas-table th {
          background-color: #f5f5f5;
          font-weight: 600;
        }

        .pieza-imagen {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
        }

        .loading {
          text-align: center;
          padding: 20px;
          font-size: 18px;
          color: #666;
        }
      `}</style>
    </div>
  );
} 