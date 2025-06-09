import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Pedidos.css';

export default function Pedidos() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      console.log('Iniciando carga de pedidos...');
      
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.log('Usuario no autenticado');
        navigate('/login');
        return;
      }

      console.log('Realizando petición a /api/pedidos');
      const response = await axios.get('http://localhost:3000/api/pedidos', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Pedidos recibidos:', response.data);
      
      // Log detallado de la estructura de cada pedido
      response.data.forEach((pedido, idx) => {
        console.log(`Pedido ${idx + 1}:`, {
          id_pedido: pedido.id_pedido,
          detalles: pedido.detalles?.map(d => ({
            id_detalle_pedido: d.id_detalle_pedido,
            id_pieza: d.id_pieza,
            nombre_pieza: d.nombre_pieza
          }))
        });
      });

      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
      
      let mensajeError = 'No se pudieron cargar los pedidos';
      if (error.response) {
        console.error('Detalles del error:', error.response.data);
        mensajeError = error.response.data.error || mensajeError;
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensajeError
      });

      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
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
    if (!detalles) return 0;
    return detalles.reduce((total, detalle) => {
      const importe = parseFloat(detalle.importe_total_pedido) || 0;
      return total + importe;
    }, 0);
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
    setPedidoSeleccionado(pedidoSeleccionado?.id_pedido === pedido.id_pedido ? null : pedido);
  };

  // Función para verificar si han pasado 5 minutos
  const puedeSerCancelado = (fechaPedido) => {
    const tiempoLimite = 5 * 60 * 1000; // 5 minutos en milisegundos
    const fechaCreacion = new Date(fechaPedido).getTime();
    const ahora = new Date().getTime();
    return (ahora - fechaCreacion) <= tiempoLimite;
  };

  // Función para cancelar pedido
  const cancelarPedido = async (pedidoId, event) => {
    // Evitar que el click se propague al div del pedido
    event.stopPropagation();

    try {
      // Confirmar con el usuario
      const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas cancelar este pedido? Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cancelar pedido',
        cancelButtonText: 'No, mantener pedido'
      });

      if (confirmacion.isConfirmed) {
        // Realizar la actualización en la base de datos
        await axios.put(`http://localhost:3000/api/pedidos/${pedidoId}/cancelar`, {}, {
          withCredentials: true
        });

        // Actualizar la lista de pedidos
        await cargarPedidos();

        Swal.fire(
          '¡Cancelado!',
          'El pedido ha sido cancelado exitosamente.',
          'success'
        );
      }
    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cancelar el pedido. Por favor, intenta nuevamente.'
      });
    }
  };

  return (
    <div className="pedidos-container">
      <aside className="sidebar">
        <div
          className="logo-wrapper"
          onClick={() => navigate('/inicio_client')}
        >
          <img src="/Logo.png" alt="Logo" />
        </div>

        <ul>
          <li onClick={() => navigate('/inicio_client')}>Inicio</li>
          <li onClick={() => navigate('/productos')}>Piezas</li>
          <li onClick={() => navigate('/pedidos')}>Pedidos</li>
          <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <h1>Mis Pedidos</h1>
          </div>
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
          <div className="pedidos-section">
            {loading ? (
              <div className="loading">Cargando pedidos...</div>
            ) : pedidos.length === 0 ? (
              <div className="no-pedidos">
                <img src="/empty-orders.png" alt="Sin pedidos" className="empty-orders-img" />
                <h2>No tienes pedidos aún</h2>
                <p>¡Explora nuestro catálogo y realiza tu primer pedido!</p>
                <button onClick={() => navigate('/productos')} className="explorar-btn">
                  Ver productos
                </button>
              </div>
            ) : (
              <div className="pedidos-lista">
                {pedidos.map((pedido) => {
                  // Log detallado de cada pedido y sus detalles
                  console.log('Detalles completos del pedido:', {
                    id_pedido: pedido.id_pedido,
                    detalles: pedido.detalles?.map(d => ({
                      id_detalle_pedido: d.id_detalle_pedido,
                      id_pieza: d.id_pieza,
                      nombre_pieza: d.nombre_pieza,
                      cantidad: d.cantidad
                    }))
                  });

                  return (
                    <div 
                      key={`pedido-${pedido.id_pedido}`} 
                      className={`pedido-card ${pedidoSeleccionado?.id_pedido === pedido.id_pedido ? 'seleccionado' : ''}`}
                      onClick={() => handleClickPedido(pedido)}
                    >
                      <div className="pedido-header">
                        <div className="pedido-info">
                          <h3>Pedido</h3>
                          <p className="fecha">{formatearFecha(pedido.fecha_pedido)}</p>
                        </div>
                        <div className="pedido-estado">
                          <span className={`estado-badge ${pedido.nombre_estado.toLowerCase()}`}>
                            {pedido.nombre_estado}
                          </span>
                          {pedido.nombre_estado === 'pendiente' && puedeSerCancelado(pedido.fecha_pedido) && (
                            <button
                              className="btn-cancelar"
                              onClick={(e) => cancelarPedido(pedido.id_pedido, e)}
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </div>

                      {(pedidoSeleccionado?.id_pedido === pedido.id_pedido) && (
                        <>
                          <div className="pedido-detalles">
                            {pedido.detalles && pedido.detalles.map((detalle, index) => {
                              // Create a truly unique key using multiple identifiers
                              const detalleKey = `pedido-${pedido.id_pedido}-detalle-${detalle.id_detalle_pedido}-pieza-${detalle.id_pieza}-${index}`;
                              
                              return (
                                <div 
                                  key={detalleKey}
                                  className="producto-detalle"
                                >
                                  <img 
                                    src={detalle.imagen_pieza || '/default-part.png'} 
                                    alt={detalle.nombre_pieza} 
                                    className="producto-imagen"
                                  />
                                  <div className="producto-info">
                                    <h4>{detalle.nombre_pieza}</h4>
                                    <p>Precio unitario: RD$ {formatearPrecio(detalle.precio_unitario_pieza)}</p>
                                    <p>Cantidad: {detalle.cantidad_detalle}</p>
                                  </div>
                                  <div className="producto-total">
                                    <p>Total: RD$ {formatearPrecio(detalle.importe_total_pedido)}</p>
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
                              <p>RD$ {formatearPrecio(calcularTotalPedido(pedido.detalles))}</p>
                            </div>
                          </div>

                          <style jsx>{`
                            .taller-nombre {
                              font-weight: 500;
                              color: #24487f;
                              margin: 5px 0;
                            }

                            .taller-direccion {
                              color: #666;
                              font-size: 0.9em;
                            }
                          `}</style>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .pedidos-container {
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
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background-color: #24487f;
          color: white;
        }

        .header-title h1 {
          margin: 0;
          color: white;
          feat/backend
        }

        .iconos-header {
          display: flex;
          align-items: center;
        }

        .cart-img,
        .perfil-img {
          width: 30px;
          height: 30px;
          cursor: pointer;
          margin-left: 15px;
        }

        .cart-img:hover,
        .perfil-img:hover {
          filter: brightness(1.2);
        }

        .content {
          padding: 40px;
          overflow-y: auto;
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
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #eee;
        }

        .producto-imagen {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
          margin-right: 15px;
        }

        .producto-info {
          flex: 1;
        }

        .producto-info h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .producto-info p {
          margin: 3px 0;
          color: #666;
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

        .explorar-btn {
          background-color: #24487f;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
          margin-top: 15px;
        }

        .explorar-btn:hover {
          background-color: #1a365d;
        }

        .btn-cancelar {
          margin-left: 10px;
          padding: 5px 15px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.9em;
          transition: background-color 0.3s ease;
        }

        .btn-cancelar:hover {
          background-color: #c82333;
        }

        .btn-cancelar:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
