import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function Carrito() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Verificar la autenticación del usuario
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/check-auth', {
          withCredentials: true
        });
        
        if (response.data.rol) {
          setUserRole(response.data.rol);
        } else {
          // Si no hay rol, redirigir al login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error de autenticación:', error);
        navigate('/login');
      }
    };

    checkAuth();
    
    // Cargar productos del carrito
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setProductos(carritoGuardado);
  }, [navigate]);

  const handleNavigate = (path) => {
    // El administrador puede acceder a todas las rutas
    if (userRole === 'administrador') {
      switch(path) {
        case 'inicio':
          navigate('/Inicio');
          break;
        case 'inicio_client':
          navigate('/Inicio_Client');
          break;
        case 'productos':
          navigate('/productos');
          break;
        case 'pedidos':
          navigate('/pedidos');
          break;
        case 'contacto':
          navigate('/contacto');
          break;
        case 'carrito':
          navigate('/carrito');
          break;
        case 'perfil':
          navigate('/perfil');
          break;
        default:
          navigate(`/${path}`);
      }
    } else {
      // Usuario normal solo accede a rutas de cliente
      switch(path) {
        case 'inicio':
          navigate('/Inicio_Client');
          break;
        default:
          navigate(`/${path}`);
      }
    }
  };

  const eliminarProducto = (id_repuesto) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas eliminar este producto del carrito?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#24487f',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevosProductos = productos.filter(p => p.id_repuesto !== id_repuesto);
        setProductos(nuevosProductos);
        localStorage.setItem('carrito', JSON.stringify(nuevosProductos));
        Swal.fire(
          '¡Eliminado!',
          'El producto ha sido eliminado del carrito.',
          'success'
        );
      }
    });
  };

  const actualizarCantidad = (id_repuesto, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    const nuevosProductos = productos.map(p => 
      p.id_repuesto === id_repuesto 
        ? { ...p, cantidad: nuevaCantidad }
        : p
    );
    setProductos(nuevosProductos);
    localStorage.setItem('carrito', JSON.stringify(nuevosProductos));
  };

  const total = productos.reduce((acc, p) => acc + p.precio_pieza * p.cantidad, 0);

  const confirmarPedido = () => {
    Swal.fire({
      title: '¿Confirmar pedido?',
      text: "¿Deseas proceder con la compra?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#24487f',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setProductos([]);
        localStorage.removeItem('carrito');
        Swal.fire(
          '¡Pedido Confirmado!',
          'Gracias por tu compra.',
          'success'
        );
      }
    });
  };

  if (!userRole) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="carrito-container">
      <aside className="sidebar">
        <div 
          className="logo-wrapper" 
          onClick={() => handleNavigate('inicio')}
        >
          <img src="/Logo.png" alt="Logo" />
        </div>

        <ul>
          {userRole === 'administrador' ? (
            <>
              <li onClick={() => handleNavigate('inicio')}>Inicio Admin</li>
              <li onClick={() => handleNavigate('inicio_client')}>Inicio Cliente</li>
              <li onClick={() => handleNavigate('productos')}>Piezas</li>
              <li onClick={() => handleNavigate('pedidos')}>Pedidos</li>
              <li onClick={() => handleNavigate('contacto')}>Sobre Nosotros</li>
            </>
          ) : (
            <>
              <li onClick={() => handleNavigate('inicio')}>Inicio</li>
              <li onClick={() => handleNavigate('productos')}>Piezas</li>
              <li onClick={() => handleNavigate('pedidos')}>Pedidos</li>
              <li onClick={() => handleNavigate('contacto')}>Sobre Nosotros</li>
            </>
          )}
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <h1>Mi Carrito</h1>
          </div>
          <div className="header-icons">
            <img
              src="/carrito.png"
              alt="Carrito"
              className="cart-img"
              onClick={() => handleNavigate('carrito')}
            />
            <img
              src="/perfil.png"
              alt="Perfil"
              className="perfil-img"
              onClick={() => handleNavigate('perfil')}
            />
          </div>
        </header>

        <section className="carrito-section">
          {productos.length === 0 ? (
            <div className="carrito-vacio">
              <img src="/empty-cart.png" alt="Carrito vacío" className="empty-cart-img" />
              <h2>Tu carrito está vacío</h2>
              <p>¡Agrega algunos productos para comenzar!</p>
              <button onClick={() => handleNavigate('productos')} className="continuar-comprando">
                Explorar productos
              </button>
            </div>
          ) : (
            <div className="carrito-content">
              <div className="productos-lista">
                {productos.map((p) => (
                  <div key={p.id_repuesto} className="producto-card">
                    <div className="producto-imagen-container">
                      <img src={p.imagen_pieza} alt={p.nombre_pieza} className="producto-imagen" />
                    </div>
                    <div className="producto-detalles">
                      <h3>{p.nombre_pieza}</h3>
                      <p className="precio">${p.precio_pieza}</p>
                      <div className="cantidad-control">
                        <button 
                          className="cantidad-btn"
                          onClick={() => actualizarCantidad(p.id_repuesto, p.cantidad - 1)}
                        >
                          -
                        </button>
                        <span>{p.cantidad}</span>
                        <button 
                          className="cantidad-btn"
                          onClick={() => actualizarCantidad(p.id_repuesto, p.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="producto-acciones">
                      <p className="subtotal">Subtotal: ${p.precio_pieza * p.cantidad}</p>
                      <button 
                        className="eliminar-btn"
                        onClick={() => eliminarProducto(p.id_repuesto)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="detalle-compra">
                <h3 className="detalle-title">Resumen de Compra</h3>
                <div className="detalle-info">
                  <div className="detalle-row">
                    <span>Subtotal</span>
                    <span>${total}</span>
                  </div>
                  <div className="detalle-row">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <div className="detalle-row total">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>
                <button className="confirmar-btn" onClick={confirmarPedido}>
                  Proceder al pago
                </button>
                <button className="seguir-comprando" onClick={() => handleNavigate('productos')}>
                  Seguir comprando
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        .carrito-container {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
          font-family: 'Segoe UI', sans-serif;
        }

        .sidebar {
          width: 250px;
          background-color: #24487f;
          color: white;
          padding: 20px;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .logo-wrapper {
          width: 120px;
          height: 120px;
          background-color: white;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .logo-wrapper:hover {
          transform: scale(1.05);
        }

        .logo-wrapper img {
          width: 90%;
          height: 90%;
          object-fit: contain;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
          margin-top: 30px;
        }

        .sidebar li {
          margin-bottom: 15px;
          cursor: pointer;
          padding: 12px 15px;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-size: 16px;
        }

        .sidebar li:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .header {
          background-color: white;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .header-title h1 {
          margin: 0;
          color: #24487f;
          font-size: 24px;
        }

        .header-icons {
          display: flex;
          gap: 20px;
        }

        .cart-img,
        .perfil-img {
          width: 30px;
          height: 30px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .cart-img:hover,
        .perfil-img:hover {
          transform: scale(1.1);
        }

        .perfil-img {
          border-radius: 50%;
          object-fit: cover;
        }

        .carrito-section {
          padding: 30px;
          flex: 1;
        }

        .carrito-vacio {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .empty-cart-img {
          width: 150px;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .carrito-vacio h2 {
          color: #333;
          margin-bottom: 10px;
        }

        .carrito-vacio p {
          color: #666;
          margin-bottom: 30px;
        }

        .continuar-comprando {
          background-color: #24487f;
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .continuar-comprando:hover {
          background-color: #1b355b;
          transform: translateY(-2px);
        }

        .carrito-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
        }

        .productos-lista {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .producto-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 20px;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .producto-card:hover {
          transform: translateY(-2px);
        }

        .producto-imagen-container {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .producto-imagen {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .producto-detalles {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .producto-detalles h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }

        .precio {
          color: #24487f;
          font-weight: bold;
          font-size: 18px;
          margin: 0;
        }

        .cantidad-control {
          display: flex;
          align-items: center;
          gap: 15px;
          background: #f8f9fa;
          padding: 8px;
          border-radius: 8px;
          width: fit-content;
        }

        .cantidad-btn {
          background-color: #24487f;
          color: white;
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s;
        }

        .cantidad-btn:hover {
          background-color: #1b355b;
        }

        .producto-acciones {
          display: flex;
          flex-direction: column;
          gap: 15px;
          align-items: flex-end;
        }

        .subtotal {
          color: #666;
          margin: 0;
        }

        .eliminar-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .eliminar-btn:hover {
          background-color: #c82333;
          transform: scale(1.05);
        }

        .detalle-compra {
          background: white;
          border-radius: 12px;
          padding: 25px;
          position: sticky;
          top: 30px;
          height: fit-content;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .detalle-title {
          color: #24487f;
          margin: 0 0 20px 0;
          font-size: 20px;
          text-align: left;
        }

        .detalle-info {
          margin-bottom: 25px;
        }

        .detalle-row {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
          color: #666;
        }

        .detalle-row.total {
          border-bottom: none;
          color: #24487f;
          font-weight: bold;
          font-size: 20px;
          margin-top: 10px;
        }

        .confirmar-btn {
          background-color: #24487f;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
          margin-bottom: 10px;
          transition: all 0.3s ease;
        }

        .confirmar-btn:hover {
          background-color: #1b355b;
          transform: translateY(-2px);
        }

        .seguir-comprando {
          background-color: transparent;
          color: #24487f;
          border: 2px solid #24487f;
          padding: 15px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          width: 100%;
          transition: all 0.3s ease;
        }

        .seguir-comprando:hover {
          background-color: #f8f9fa;
          transform: translateY(-2px);
        }

        @media (max-width: 1200px) {
          .carrito-content {
            grid-template-columns: 1fr;
          }

          .detalle-compra {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }

          .producto-card {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .producto-imagen-container {
            margin: 0 auto;
          }

          .producto-acciones {
            align-items: center;
          }

          .header {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
}
