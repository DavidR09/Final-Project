import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from './hooks/useAuth';

// Configurar axios para incluir credenciales en todas las solicitudes
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const axiosInstance = axios.create({
  baseURL: 'https://backend-respuestosgra.up.railway.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token a todas las peticiones
axiosInstance.interceptors.request.use(request => {
  const token = localStorage.getItem('token');
  console.log('Token en localStorage:', token);
  
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
    console.log('Headers de la petición:', request.headers);
  } else {
    console.log('No se encontró token en localStorage');
  }
  return request;
}, error => {
  console.error('Error en el interceptor de request:', error);
  return Promise.reject(error);
});

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en la respuesta:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return Promise.reject(error);
  }
);

export default function AdminPedidos() {
  const navigate = useNavigate();
  const { checkAuth, isAuthenticated, userRole, isLoading } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [showRepuestosModal, setShowRepuestosModal] = useState(false);
  const [repuestosDisponibles, setRepuestosDisponibles] = useState([]);
  const [repuestosSeleccionados, setRepuestosSeleccionados] = useState([]);
  const [loadingRepuestos, setLoadingRepuestos] = useState(false);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        console.log('Verificando acceso...');
        console.log('Estado de autenticación:', {
          isAuthenticated,
          userRole,
          token: localStorage.getItem('token')
        });

        // Esperar a que la verificación de autenticación termine
        if (isLoading) {
          console.log('Esperando verificación de autenticación...');
          return;
        }

        // Verificar autenticación usando el hook
        await checkAuth();

        if (!isAuthenticated) {
          throw new Error('No hay sesión activa');
        }

        if (userRole !== 'administrador') {
          throw new Error('No tienes permisos de administrador');
        }

        console.log('Acceso verificado, cargando pedidos...');
        await cargarPedidos();
      } catch (error) {
        console.error('Error de acceso:', error);
        
        let mensajeError = 'Por favor, inicia sesión como administrador';
        
        if (error.message === 'No hay sesión activa') {
          mensajeError = 'No hay una sesión activa. Por favor, inicia sesión.';
        } else if (error.message === 'No tienes permisos de administrador') {
          mensajeError = 'No tienes permisos para acceder a esta página';
        }

        await Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: mensajeError,
          confirmButtonColor: '#24487f'
        });

        // Limpiar datos de sesión
        localStorage.clear();
        sessionStorage.clear();
        
        navigate('/login');
      }
    };

    verifyAccess();
  }, [navigate, checkAuth, isAuthenticated, userRole, isLoading]);

  const cargarPedidos = async () => {
    try {
      const response = await axiosInstance.get('/api/pedidos/admin');
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
      throw error;
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

  const cargarRepuestosDisponibles = async () => {
    if (!pedidoSeleccionado) return;
    
    setLoadingRepuestos(true);
    try {
      const response = await axiosInstance.get('/api/repuestos/con-piezas');
      // Filtrar repuestos que contienen las piezas del pedido
      const repuestosFiltrados = response.data.filter(repuesto => {
        // Obtener los IDs de los repuestos (piezas) del pedido
        const piezasPedidoIds = pedidoSeleccionado.detalles.map(detalle => detalle.id_pieza);
        // Verificar si el repuesto tiene alguna de las piezas del pedido
        return repuesto.piezas?.some(pieza => piezasPedidoIds.includes(pieza.id_repuesto));
      });
      setRepuestosDisponibles(repuestosFiltrados);
    } catch (error) {
      console.error('Error al cargar repuestos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los repuestos disponibles',
        confirmButtonColor: '#24487f'
      });
    } finally {
      setLoadingRepuestos(false);
    }
  };

  const abrirModalRepuestos = () => {
    setShowRepuestosModal(true);
    cargarRepuestosDisponibles();
  };

  const cerrarModalRepuestos = () => {
    setShowRepuestosModal(false);
    setRepuestosSeleccionados([]);
  };

  const seleccionarRepuesto = (repuesto) => {
    setRepuestosSeleccionados(prev => {
      const existe = prev.find(r => r.id_repuesto === repuesto.id_repuesto);
      if (existe) {
        return prev.filter(r => r.id_repuesto !== repuesto.id_repuesto);
      }
      return [...prev, repuesto];
    });
  };

  const confirmarSeleccionRepuestos = async () => {
    if (repuestosSeleccionados.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Selección requerida',
        text: 'Debe seleccionar al menos un repuesto',
        confirmButtonColor: '#24487f'
      });
      return;
    }

    try {
      // Actualizar el estado del pedido a 'EN PROCESO' y guardar los repuestos asignados
      await axiosInstance.put(`/api/pedidos/${pedidoSeleccionado.id_pedido}/asignar-repuestos`, {
        repuestos: repuestosSeleccionados.map(r => r.id_repuesto),
        nuevoEstado: 'EN PROCESO'
      });
      // Refrescar los pedidos para mostrar el cambio
      await cargarPedidos();
      setPedidoSeleccionado(null); // Para que se actualice la selección
      await Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Repuestos asignados correctamente y pedido en proceso',
        confirmButtonColor: '#24487f'
      });
      cerrarModalRepuestos();
    } catch (error) {
      console.error('Error al confirmar repuestos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron asignar los repuestos',
        confirmButtonColor: '#24487f'
      });
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
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
                          <button 
                            className="btn-asignar-repuestos"
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirModalRepuestos();
                            }}
                          >
                            Asignar Repuestos
                          </button>
                        </div>

                        {/* Mostrar repuestos asignados arriba de la caja del pedido */}
                        {pedidoSeleccionado?.repuestos_asignados && pedidoSeleccionado.repuestos_asignados.length > 0 && (
                          <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#24487f' }}>
                            Repuestos asignados: {pedidoSeleccionado.repuestos_asignados.map(r => r.nombre_repuesto).join(', ')}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modal de Repuestos */}
      {showRepuestosModal && (
        <div className="modal-overlay">
          <div className="modal-content repuestos-modal" style={{ color: '#111' }}>
            <button className="close-modal" onClick={cerrarModalRepuestos}>&times;</button>
            <h2 style={{ color: '#111' }}>Seleccionar Repuestos</h2>
            
            {loadingRepuestos ? (
              <div className="loading">Cargando repuestos...</div>
            ) : (
              <div className="repuestos-grid">
                {repuestosDisponibles.map((repuesto) => {
                  // Filtrar solo la(s) pieza(s) exacta(s) que el cliente pidió
                  const piezasPedidoIds = pedidoSeleccionado.detalles.map(detalle => detalle.id_pieza);
                  const piezasFiltradas = repuesto.piezas?.filter(pieza => 
                    piezasPedidoIds.includes(pieza.id_repuesto)
                  ) || [];
                  // Si no hay piezas que coincidan, no renderizar este repuesto
                  if (piezasFiltradas.length === 0) return null;
                  return (
                    <div 
                      key={repuesto.id_repuesto}
                      className={`repuesto-card ${repuestosSeleccionados.some(r => r.id_repuesto === repuesto.id_repuesto) ? 'seleccionado' : ''}`}
                      onClick={() => seleccionarRepuesto(repuesto)}
                      style={{ color: '#111', fontWeight: 'bold', fontSize: '1.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px' }}
                    >
                      {repuesto.nombre_repuesto}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="modal-footer">
              <button 
                className="btn-cancelar"
                onClick={cerrarModalRepuestos}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirmar"
                onClick={confirmarSeleccionRepuestos}
              >
                Confirmar Selección
              </button>
            </div>
          </div>
        </div>
      )}

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

        .btn-asignar-repuestos {
          background-color: #24487f;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
          transition: background-color 0.3s ease;
        }

        .btn-asignar-repuestos:hover {
          background-color: #1b355b;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(36, 72, 127, 0.2);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .repuestos-modal {
          background: #f4f8fb;
          padding: 20px;
          border-radius: 8px;
          width: 80%;
          max-width: 1000px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .repuestos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }

        .repuesto-card {
          border: 1px solid #b3c6e0;
          border-radius: 8px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          background-color: #eaf1fa;
        }

        .repuesto-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .repuesto-card.seleccionado {
          border: 2px solid #24487f;
          background-color: #d6e4f5;
        }

        .piezas-lista {
          margin-top: 10px;
        }

        .pieza-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #c3d0e6;
          background-color: #fafdff;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .pieza-item img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 4px;
          margin-right: 10px;
        }

        .pieza-info {
          flex: 1;
        }

        .pieza-info p {
          margin: 2px 0;
          font-size: 0.9em;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .btn-cancelar,
        .btn-confirmar {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .btn-cancelar {
          background-color: #e0e0e0;
          color: #333;
        }

        .btn-confirmar {
          background-color: #24487f;
          color: white;
        }

        .btn-cancelar:hover {
          background-color: #d0d0d0;
        }

        .btn-confirmar:hover {
          background-color: #1b355b;
        }

        .close-modal {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .close-modal:hover {
          color: #333;
        }
      `}</style>
    </div>
  );
}