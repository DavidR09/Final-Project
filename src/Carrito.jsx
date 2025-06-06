import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import PaymentModal from './components/PaymentModal';
import './Carrito.css';
import './styles/global.css';

export default function Carrito() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ method: 'tarjeta' });

  useEffect(() => {
    // Verificar la autenticación del usuario
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/check-auth', {
          withCredentials: true
        });
        
        if (response.data.rol) {
          setUserRole(response.data.rol);
          // Cargar productos del carrito específico del usuario
          const userId = localStorage.getItem('userId');
          const carritoKey = `carrito_${userId}`;
          const carritoGuardado = JSON.parse(localStorage.getItem(carritoKey)) || [];
          setProductos(carritoGuardado);
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
  }, [navigate]);

  // Función para verificar el stock disponible
  const verificarStock = async () => {
    try {
      // Obtener los productos actualizados de la base de datos
      const response = await axios.get('http://localhost:3000/api/productos');
      const productosDB = response.data;

      // Verificar el stock para cada producto en el carrito
      for (const productoCarrito of productos) {
        const productoDB = productosDB.find(p => p.id_repuesto === productoCarrito.id_repuesto);
        
        if (!productoDB) {
          throw new Error(`El producto ${productoCarrito.nombre_pieza} ya no está disponible.`);
        }

        if (productoDB.cantidad_pieza < productoCarrito.cantidad) {
          throw new Error(`Stock insuficiente para ${productoCarrito.nombre_pieza}. Stock disponible: ${productoDB.cantidad_pieza}`);
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleNavigate = (path) => {
    // Si es administrador, usar las rutas de admin, si no, usar las rutas normales
    if (userRole === 'administrador') {
      switch(path) {
        case 'inicio':
          navigate('/Inicio');
          break;
        default:
          navigate(`/${path}`);
      }
    } else {
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
        const userId = localStorage.getItem('userId');
        const carritoKey = `carrito_${userId}`;
        localStorage.setItem(carritoKey, JSON.stringify(nuevosProductos));
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
    const userId = localStorage.getItem('userId');
    const carritoKey = `carrito_${userId}`;
    localStorage.setItem(carritoKey, JSON.stringify(nuevosProductos));
  };

  const total = productos.reduce((acc, p) => acc + p.precio_pieza * p.cantidad, 0);

  const handlePaymentSuccess = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      const carritoKey = `carrito_${userId}`;
      console.log('Productos en el carrito:', productos);
      
      // Mapear los productos al formato correcto
      const productosFormateados = productos.map(item => ({
        id_repuesto: item.id_repuesto,
        cantidad: item.cantidad,
        precio: item.precio_pieza
      }));
      
      console.log('Productos formateados:', productosFormateados);

      const pedidoData = {
        productos: productosFormateados,
        total: total * 1.18, // Total con ITBIS
        estado: "pendiente",
        id_usuario: parseInt(userId),
        direccion_envio_pedido: "Pendiente", // Valor por defecto temporal
        metodo_pago: paymentDetails.method // Usamos el método seleccionado
      };

      console.log('Datos del pedido a enviar:', pedidoData);

      const pedidoResponse = await axios.post('http://localhost:3000/api/pedidos', pedidoData);
      console.log('Respuesta del servidor:', pedidoResponse.data);

      // Limpiar el carrito
      localStorage.removeItem(carritoKey);
      setProductos([]);
      setIsPaymentModalOpen(false);

      // Mostrar mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Pedido realizado con éxito!',
        text: 'Tu pedido ha sido registrado y será procesado pronto.',
        confirmButtonColor: '#24487f'
      });

      navigate('/pedidos');
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      if (error.response) {
        console.error('Detalles del error:', error.response.data);
      }

      // Mostrar mensaje de error
      let errorMessage = 'Hubo un problema al procesar tu pedido.';
      if (error.message === 'No se encontró la dirección del usuario') {
        errorMessage = 'Por favor, actualiza tu dirección en tu perfil antes de realizar un pedido.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#24487f'
      });
    }
  };

  const confirmarPedido = async () => {
    if (productos.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Carrito vacío',
        text: 'Agrega productos al carrito antes de proceder al pago.',
        confirmButtonColor: '#24487f'
      });
      return;
    }

    try {
      // Verificar stock antes de abrir el modal de pago
      await verificarStock();
      setIsPaymentModalOpen(true);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error de stock',
        text: error.message,
        confirmButtonColor: '#24487f'
      });
    }
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
          <li onClick={() => handleNavigate('inicio')}>Inicio</li>
          <li onClick={() => handleNavigate('productos')}>Piezas</li>
          <li onClick={() => handleNavigate('pedidos')}>Pedidos</li>
          <li onClick={() => handleNavigate('contacto')}>Sobre Nosotros</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <h1>Mi Carrito</h1>
          </div>
          <div className="iconos-header">
            <img
              src="/carrito.png"
              alt="Carrito"
              onClick={() => handleNavigate('carrito')}
            />
            <img
              src="/perfil.png"
              alt="Perfil"
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
                  <div key={`${p.id_repuesto}-${p.nombre_pieza}`} className="producto-card">
                    <div className="producto-imagen-container">
                      <img src={p.imagen_pieza} alt={p.nombre_pieza} className="producto-imagen" />
                    </div>
                    <div className="producto-detalles">
                      <h3>{p.nombre_pieza}</h3>
                      <p className="precio">RD$ {p.precio_pieza}</p>
                      <div className="cantidad-control">
                        <button 
                          className="cantidad-btn"
                          onClick={() => actualizarCantidad(p.id_repuesto, p.cantidad - 1)}
                        >
                          -
                        </button>
                        <span className="cantidad-display">{p.cantidad}</span>
                        <button 
                          className="cantidad-btn"
                          onClick={() => actualizarCantidad(p.id_repuesto, p.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="producto-acciones">
                      <p className="subtotal">Subtotal: RD$ {p.precio_pieza * p.cantidad}</p>
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
                    <span>RD$ {total.toFixed(2)}</span>
                  </div>
                  <div className="detalle-row">
                    <span>ITBIS</span>
                    <span>RD$ {(total * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="detalle-row">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  <div className="detalle-row total">
                    <span>Total</span>
                    <span>RD$ {(total * 1.18).toFixed(2)}</span>
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

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={total}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
