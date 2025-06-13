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

export default function AdminPedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/check-auth');
        if (response.data.rol !== 'administrador') {
          throw new Error('No tienes permisos de administrador');
        }
        cargarPedidos();
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

  const cargarPedidos = async () => {
    try {
      console.log('Iniciando carga de pedidos...');
      
      const response = await axiosInstance.get('https://backend-respuestosgra.up.railway.app/api/pedidos/admin');

      console.log('Pedidos recibidos:', response.data);
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
      
      let mensajeError = 'No se pudieron cargar los pedidos';
      if (error.response) {
        console.error('Detalles del error:', error.response.data);
        mensajeError = error.response.data.error || mensajeError;

        // Si el error es de autenticación o autorización, redirigir al login
        if (error.response.status === 401 || error.response.status === 403) {
          await Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'Por favor, inicia sesión nuevamente.',
            confirmButtonColor: '#24487f'
          });
          navigate('/login');
          return;
        }
      }

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensajeError,
        confirmButtonColor: '#24487f'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearPrecio = (precio) => {
    const numero = parseFloat(precio);
    return !isNaN(numero) ? numero.toFixed(2) : '0.00';
  };

  const calcularTotalPedido = (detalles) => {
    if (!detalles || detalles.length === 0) return 0;
    return parseFloat(detalles[0].importe_total_pedido || 0);
  };

  const handleClickPedido = (pedido) => {
    console.log('Pedido seleccionado:', {
      id_pedido: pedido.id_pedido,
      detalles: pedido.detalles?.map(d => ({
        id_detalle: d.id_detalle_pedido,
        id_pieza: d.id_pieza,
        nombre_pieza: d.nombre_pieza,
        cantidad: d.cantidad_detalle,
        precio: d.precio_unitario_pieza,
        total: d.importe_total_pedido
      }))
    });
    
    const detallesUnicos = pedido.detalles ? 
      Array.from(new Map(pedido.detalles.map(d => [d.id_detalle_pedido, d])).values()) 
      : [];
    
    setPedidoSeleccionado(
      pedidoSeleccionado?.id_pedido === pedido.id_pedido 
        ? null 
        : { ...pedido, detalles: detallesUnicos }
    );
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
          <li onClick={() => navigate('/admin-pedidos')} className="active">Ver Pedidos Clientes</li>
          <li onClick={() => navigate('/admin-repuestos-piezas')}>Gestionar Repuestos y Piezas</li>
          <li onClick={() => navigate('/admin-usuarios')}>Gestionar Usuarios</li>
          <li onClick={() => navigate('/Inicio_Client')}>Ver Vista Cliente</li>
          <li onClick={() => navigate('/')}>Cerrar sesión</li>
        </ul>
      </aside>

      <main className="main-content">
        <section className="content">
          <div className="welcome">
            <h1>Pedidos de Usuarios</h1>
          </div>

          <div className="pedidos-section">
            {loading ? (
              <div className="loading">Cargando pedidos...</div>
            ) : pedidos.length === 0 ? (
              <div className="no-pedidos">
                <img src="/empty-orders.png" alt="Sin pedidos" className="empty-orders-img" />
                <h2>No hay pedidos registrados</h2>
                <p>Aún no hay pedidos en el sistema</p>
              </div>
            ) : (
              <div className="pedidos-lista">
                {pedidos.map((pedido) => (
                  <div 
                    key={`pedido-${pedido.id_pedido}`} 
                    className={`pedido-card ${pedidoSeleccionado?.id_pedido === pedido.id_pedido ? 'seleccionado' : ''}`}
                    onClick={() => handleClickPedido(pedido)}
                  >
                    <div className="pedido-header">
                      <div className="pedido-info">
                        <h3>Pedido #{pedido.id_pedido}</h3>
                        <p className="cliente-info">
                          <strong>Cliente:</strong> {pedido.nombre_usuario} {pedido.apellido_usuario}
                        </p>
                        <p className="fecha">{formatearFecha(pedido.fecha_pedido)}</p>
                      </div>
                      <div className="pedido-estado">
                        <span className={`estado-badge ${pedido.nombre_estado.toLowerCase()}`}>
                          {pedido.nombre_estado}
                        </span>
                      </div>
                    </div>

                    {(pedidoSeleccionado?.id_pedido === pedido.id_pedido) && (
                      <>
                        <div className="pedido-detalles">
                          {pedido.detalles && Array.from(new Set(pedido.detalles.map(d => d.id_detalle_pedido))).map(detalleId => {
                            const detalle = pedido.detalles.find(d => d.id_detalle_pedido === detalleId);
                            if (!detalle) return null;
                            
                            return (
                              <div 
                                key={`pedido-${pedido.id_pedido}-detalle-${detalle.id_detalle_pedido}`}
                                className="producto-detalle"
                              >
                                <img 
                                  src={detalle.imagen_pieza || '/default-part.png'} 
                                  alt={detalle.nombre_pieza}
                                  onError={(e) => {
                                    e.target.onerror = null; // Prevenir loop infinito
                                    e.target.src = '/default-part.png';
                                  }}
                                  className="producto-imagen"
                                />
                                <div className="producto-info">
                                  <h4>{detalle.nombre_pieza}</h4>
                                  <p>Precio sin ITBIS: RD$ {formatearPrecio(detalle.precio_unitario_pieza)}</p>
                                  <p>Cantidad: {detalle.cantidad_detalle}</p>
                                </div>
                                <div className="producto-total">
                                  <p>Total (con ITBIS): RD$ {formatearPrecio(detalle.importe_total_pedido)}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pedido-footer">
                          <div className="pedido-direccion">
                            <strong>Taller asignado:</strong>
                            {pedido.nombre_taller ? (
                              <>
                                <p className="taller-nombre">{pedido.nombre_taller}</p>
                                <p className="taller-direccion">{pedido.direccion_taller}</p>
                              </>
                            ) : (
                              <p>Taller por asignar</p>
                            )}
                          </div>
                          <div className="pedido-total">
                            <strong>Total del pedido:</strong>
                            <p>RD$ {formatearPrecio(pedido.total_pedido || calcularTotalPedido(pedido.detalles))}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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

        .sidebar li.active {
          background-color: #1b355b;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .content {
          padding: 40px;
          overflow-y: auto;
        }

        .welcome {
          margin-bottom: 30px;
          text-align: center;
        }

        .welcome h1 {
          color: #24487f;
          font-size: 32px;
          margin-bottom: 10px;
        }

        .pedidos-section {
          max-width: 800px;
          margin: 0 auto;
        }

        .pedido-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pedido-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .pedido-card.seleccionado {
          border: 2px solid #24487f;
        }

        .pedido-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .cliente-info {
          margin: 5px 0;
          color: #666;
        }

        .estado-badge {
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 0.9em;
          font-weight: 500;
        }

        .estado-badge.pendiente {
          background-color: #ffd700;
          color: #000;
        }

        .estado-badge.completado {
          background-color: #4CAF50;
          color: white;
        }

        .estado-badge.cancelado {
          background-color: #f44336;
          color: white;
        }

        .pedido-detalles {
          margin-bottom: 15px;
        }

        .producto-detalle {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          border-bottom: 1px solid #eee;
          gap: 15px;
        }

        .producto-imagen {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
        }

        /* Agregar efecto de hover a las imágenes */
        .producto-imagen:hover {
          transform: scale(1.1);
          transition: transform 0.3s ease;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .producto-info {
          flex: 1;
        }

        .producto-info h4 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 1.1em;
        }

        .producto-info p {
          margin: 4px 0;
          color: #666;
        }

        .producto-total {
          min-width: 200px;
          text-align: right;
          padding-left: 15px;
          border-left: 1px solid #eee;
        }

        .producto-total p {
          margin: 4px 0;
          color: #24487f;
          font-weight: 500;
        }

        .pedido-footer {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }

        .pedido-direccion,
        .pedido-total {
          margin-top: 10px;
        }

        .pedido-total {
          text-align: right;
          font-size: 1.1em;
        }

        .no-pedidos {
          text-align: center;
          padding: 40px;
        }

        .empty-orders-img {
          width: 200px;
          margin-bottom: 20px;
        }

        .taller-nombre {
          font-weight: 500;
          color: #24487f;
          margin: 5px 0;
        }

        .taller-direccion {
          color: #666;
          font-size: 0.9em;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
} 