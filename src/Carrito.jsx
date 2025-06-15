import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import PaymentModal from './components/PaymentModal';
import './Carrito.css';
import './styles/global.css';
import HeaderIcons from './components/HeaderIcons';

const data = await response.json();
        console.log('Datos de autenticación:', data);

// Función para obtener el token de las cookies
const getTokenFromCookie = () => {
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find(row => row.startsWith('token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

// Configurar axios
const axiosInstance = axios.create({
  baseURL: 'https://backend-respuestosgra.up.railway.app/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar el token en cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default function Carrito() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const paymentDetailsRef = useRef(null);
  const [selectedTaller, setSelectedTaller] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const handlePaymentDetailsChange = async (details) => {
    console.log('A. Recibiendo detalles de pago en Carrito:', details);
    return new Promise((resolve) => {
      setPaymentDetails(details);
      paymentDetailsRef.current = details;
      console.log('B. Estado actualizado de paymentDetails:', details);
      console.log('B.1 Estado en referencia:', paymentDetailsRef.current);
      setTimeout(() => {
        console.log('C. Estado final de paymentDetails después del timeout:', paymentDetailsRef.current);
        resolve(details);
      }, 100);
    });
  };

  useEffect(() => {
    // Verificar la autenticación del usuario
    const checkAuth = async () => {
      try {
        // Verificar que existe el token
        const token = getTokenFromCookie();
        if (!token) {
          console.log('No se encontró token en las cookies');
          navigate('/login');
          return;
        }

        console.log('Token encontrado:', token.substring(0, 20) + '...');
        
        const response = await axiosInstance.get('/api/auth/check-auth');
        
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
        if (error.response?.status === 401) {
          // Limpiar datos y redirigir
          document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          localStorage.removeItem('userId');
        }
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Función para verificar el stock disponible
  const verificarStock = async () => {
    try {
      // Usar axiosInstance para mantener consistencia
      const response = await axiosInstance.get('/api/productos');
      const productosDB = response.data;

      // Verificamos cada producto del carrito
      for (const producto of productos) {
        // Buscamos el producto en la base de datos por ID y nombre
        const productoDB = productosDB.find(p => 
          p.id_repuesto === producto.id_repuesto && 
          p.nombre_pieza === producto.nombre_pieza
        );
        
        if (!productoDB) {
          throw new Error(`No se encontró el producto ${producto.nombre_pieza} en el catálogo.`);
        }

        console.log('Verificando producto:', {
          nombre: producto.nombre_pieza,
          id: producto.id_repuesto,
          precio: producto.precio_pieza,
          stockDisponible: productoDB.cantidad_pieza,
          cantidadSolicitada: producto.cantidad
        });

        if (productoDB.cantidad_pieza <= 0) {
          throw new Error(`El producto ${producto.nombre_pieza} no está disponible actualmente.`);
        }

        if (parseInt(productoDB.cantidad_pieza) < producto.cantidad) {
          throw new Error(`Stock insuficiente para ${producto.nombre_pieza}. Stock disponible: ${productoDB.cantidad_pieza}`);
        }

        // Actualizamos el precio por si ha cambiado
        if (producto.precio_pieza !== productoDB.precio_pieza) {
          producto.precio_pieza = parseFloat(productoDB.precio_pieza);
        }
      }

      // Actualizamos el carrito en localStorage con los datos actualizados
      const userId = localStorage.getItem('userId');
      const carritoKey = `carrito_${userId}`;
      localStorage.setItem(carritoKey, JSON.stringify(productos));

      return true;
    } catch (error) {
      console.error('Error en verificación de stock:', error);
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

  const eliminarProducto = (id_repuesto, nombre_pieza) => {
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
        const nuevosProductos = productos.filter(p => 
          !(p.id_repuesto === id_repuesto && p.nombre_pieza === nombre_pieza)
        );
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

  const actualizarCantidad = async (id_repuesto, nombre_pieza, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    try {
      // Verificar stock disponible antes de actualizar usando axiosInstance
      const response = await axiosInstance.get('/api/productos');
      const productoDB = response.data.find(p => 
        p.id_repuesto === id_repuesto && 
        p.nombre_pieza === nombre_pieza
      );

      if (!productoDB) {
        throw new Error('Producto no encontrado en el catálogo');
      }

      if (nuevaCantidad > parseInt(productoDB.cantidad_pieza)) {
        throw new Error(`No hay suficiente stock disponible. Stock actual: ${productoDB.cantidad_pieza}`);
      }

      const nuevosProductos = productos.map(p => 
        (p.id_repuesto === id_repuesto && p.nombre_pieza === nombre_pieza)
          ? { ...p, cantidad: nuevaCantidad }
          : p
      );
      
      setProductos(nuevosProductos);
      const userId = localStorage.getItem('userId');
      const carritoKey = `carrito_${userId}`;
      localStorage.setItem(carritoKey, JSON.stringify(nuevosProductos));
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al actualizar la cantidad',
        confirmButtonColor: '#24487f'
      });
    }
  };

  const total = productos.reduce((acc, p) => acc + p.precio_pieza * p.cantidad, 0);

  const handlePaymentSuccess = async () => {
    console.log('1. Iniciando proceso de pago');

    const currentPaymentDetails = paymentDetailsRef.current;
    const currentUserId = localStorage.getItem('userId');
    const carritoKey = `carrito_${currentUserId}`;

    if (!currentPaymentDetails || !currentPaymentDetails.method) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe seleccionar un método de pago',
        confirmButtonColor: '#24487f'
      });
      return;
    }

    try {
      if (!currentUserId) {
        throw new Error('Usuario no autenticado');
      }

      // Verificar que el token esté presente
      const token = getTokenFromCookie();
      if (!token) {
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      }

      // Verificar stock antes de procesar el pago
      await verificarStock();

      // Calcular el total sin ITBIS
      const subtotal = productos.reduce((acc, item) => {
        return acc + (item.precio_pieza * item.cantidad);
      }, 0);

      console.log('Desglose de precios:', {
        productos: productos.map(item => ({
          nombre: item.nombre_pieza,
          id: item.id_repuesto,
          precio_unitario: item.precio_pieza,
          cantidad: item.cantidad,
          subtotal: item.precio_pieza * item.cantidad
        })),
        subtotal: subtotal,
        totalConITBIS: subtotal * 1.18
      });

      const pedidoData = {
        productos: productos.map(item => ({
          id_repuesto: item.id_repuesto,
          cantidad: item.cantidad,
          precio: item.precio_pieza // Precio sin ITBIS
        })),
        total: subtotal * 1.18, // Total con ITBIS
        estado: 'Pendiente',
        id_usuario: parseInt(currentUserId),
        direccion_envio_pedido: selectedTaller ? selectedTaller.direccion_taller : 'Sin taller asignado',
        metodo_pago: currentPaymentDetails.method,
        id_taller: selectedTaller ? selectedTaller.id_taller : null
      };

      console.log('Datos del pedido a enviar:', pedidoData);
      console.log('Token usado para la petición:', token.substring(0, 20) + '...');

      const response = await axiosInstance.post('/api/pedidos', pedidoData);
      console.log('Respuesta del servidor:', response.data);

      // Limpiar carrito después de crear el pedido exitosamente
      localStorage.setItem(carritoKey, JSON.stringify([]));
      setProductos([]);

      await Swal.fire({
        icon: 'success',
        title: '¡Pedido creado!',
        text: 'Su pedido ha sido creado exitosamente',
        confirmButtonColor: '#24487f'
      });

      // Cerrar el modal de pago si está abierto
      if (typeof setIsPaymentModalOpen === 'function') {
        setIsPaymentModalOpen(false);
      }

      // Redirigir a la página de pedidos
      navigate('/pedidos');
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      
      let mensajeError = 'Hubo un error al procesar su pedido';
      if (error.response?.status === 401) {
        mensajeError = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
        // Limpiar datos y redirigir al login
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        localStorage.removeItem('userId');
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response?.data?.error) {
        mensajeError = error.response.data.error;
      } else if (error.message) {
        mensajeError = error.message;
      }

      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: mensajeError,
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
      <div className="sidebar">
        <div className="logo-wrapper" onClick={() => navigate('/inicio_client')}>
          <img src="/Logo.png" alt="Logo" />
        </div>
        <ul>
          <li onClick={() => navigate('/inicio_client')}>Inicio</li>
          <li onClick={() => navigate('/productos')}>Piezas</li>
          <li onClick={() => navigate('/pedidos')}>Pedidos</li>
          <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
          {userRole === 'administrador' && (
            <li onClick={() => navigate('/Inicio')}>Volver al Panel Admin</li>
          )}
        </ul>
      </div>

      <main className="main-content">
        <header className="header">
          <div className="header-title">
            <h1 style={{ fontSize: '23px' }}>Mi Carrito</h1>
          </div>
          <HeaderIcons />
        </header>

        <section className="content">
          <div className="welcome">
            <h1 style={{ fontSize: '20px', marginBottom: '20px' }}>Mi Carrito</h1>
          </div>
          {productos.length === 0 ? (
            <div className="carrito-vacio">
              <img src="/empty-cart.png" alt="Carrito vacío" className="empty-cart-img" />
              <h2>Tu carrito está vacío</h2>
              <p>¡Agrega algunos productos para comenzar!</p>
              <button className="continuar-comprando" onClick={() => navigate('/productos')}>
                Continuar comprando
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
                      <p className="precio">RD$ {p.precio_pieza.toFixed(2)}</p>
                      <div className="cantidad-control">
                        <button 
                          className="cantidad-btn"
                          onClick={() => actualizarCantidad(p.id_repuesto, p.nombre_pieza, p.cantidad - 1)}
                        >
                          -
                        </button>
                        <span className="cantidad-display">{p.cantidad}</span>
                        <button 
                          className="cantidad-btn"
                          onClick={() => actualizarCantidad(p.id_repuesto, p.nombre_pieza, p.cantidad + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="producto-acciones">
                      <p className="subtotal">Subtotal: RD$ {(p.precio_pieza * p.cantidad).toFixed(2)}</p>
                      <button 
                        className="eliminar-btn"
                        onClick={() => eliminarProducto(p.id_repuesto, p.nombre_pieza)}
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
        onConfirm={handlePaymentSuccess}
        onPaymentDetailsChange={handlePaymentDetailsChange}
        onTallerSelect={setSelectedTaller}
      />
    </div>
  );
}