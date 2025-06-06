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
    setPedidoSeleccionado(pedidoSeleccionado?.id_pedido === pedido.id_pedido ? null : pedido);
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
          <li key="inicio" onClick={() => navigate('/inicio_client')}>Inicio</li>
          <li key="piezas" onClick={() => navigate('/productos')}>Piezas</li>
          <li key="pedidos" onClick={() => navigate('/pedidos')}>Pedidos</li>
          <li key="contacto" onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
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
                {pedidos.map((pedido) => (
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
                      </div>
                    </div>

                    {(pedidoSeleccionado?.id_pedido === pedido.id_pedido) && (
                      <>
                        <div className="pedido-detalles">
                          {pedido.detalles && pedido.detalles.map((detalle) => (
                            <div key={`detalle-${detalle.id_detalle_pedido}`} className="producto-detalle">
                              <img 
                                src={detalle.imagen_pieza} 
                                alt={detalle.nombre_pieza} 
                                className="producto-imagen"
                              />
                              <div className="producto-info">
                                <h4>{detalle.nombre_pieza}</h4>
                                <p>Precio unitario: RD$ {formatearPrecio(detalle.precio_unitario_pieza)}</p>
                                <p>Cantidad: {detalle.cantidad || 0}</p>
                              </div>
                              <div className="producto-total">
                                <p>Total: RD$ {formatearPrecio(detalle.importe_total_pedido)}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pedido-footer">
                          <div className="pedido-direccion">
                            <strong>Dirección de envío:</strong>
                            <p>{pedido.direccion_envio_pedido || 'Por confirmar'}</p>
                          </div>
                          <div className="pedido-total">
                            <strong>Total del pedido:</strong>
                            <p>RD$ {formatearPrecio(calcularTotalPedido(pedido.detalles))}</p>
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
      `}</style>
    </div>
  );
}
