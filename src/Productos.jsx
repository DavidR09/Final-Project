import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from './components/Sidebar';
import HeaderIcons from './components/HeaderIcons';
import './styles/global.css';

export default function Productos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  // Obtener parámetros de la URL
  const searchParams = new URLSearchParams(location.search);
  const categoriaId = searchParams.get('categoriaId');
  const categoriaNombre = searchParams.get('nombre');

  useEffect(() => {
    // Verificar el rol del usuario
    const checkUserRole = async () => {
      try {
        const response = await fetch('https://backend-respuestosgra.up.railway.app/api/auth/check-auth', {
          credentials: 'include'
        });
        const data = await response.json();
        setUserRole(data.rol);
      } catch (error) {
        console.error('Error al verificar el rol:', error);
      }
    };

    checkUserRole();

    setIsLoading(true);
    fetch('https://backend-respuestosgra.up.railway.app/api/productos')
      .then((res) => res.json())
      .then((data) => {
        const productosUnicos = data.map((prod, index) => ({
          ...prod,
          precio_pieza: parseFloat(prod.precio_pieza),
          uniqueKey: `${prod.id_repuesto}-${index}`
        }));
        setProductos(productosUnicos);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error al obtener productos:', err);
        setIsLoading(false);
      });
  }, []);

  // Usar useMemo para el filtrado de productos
  const productosFiltrados = useMemo(() => {
    // Log inicial para depuración
    console.log('Iniciando filtrado:', {
      totalProductos: productos.length,
      categoriaId,
      productos: productos.map(p => ({
        nombre: p.nombre_pieza,
        categoriaId: p.id_categoria_pieza
      }))
    });

    return productos.filter(prod => {
      // Primero filtrar por categoría si existe en la URL
      if (categoriaId) {
        // Asegurarnos de que ambos valores son números
        const idCategoriaProducto = Number(prod.id_categoria_pieza);
        const idCategoriaFiltro = Number(categoriaId);

        // Log para depuración
        console.log('Comparando producto:', {
          nombre: prod.nombre_pieza,
          idProducto: idCategoriaProducto,
          idFiltro: idCategoriaFiltro,
          coincide: idCategoriaProducto === idCategoriaFiltro
        });

        if (idCategoriaProducto !== idCategoriaFiltro) {
          return false;
        }
      }

      // Luego aplicar el filtro de búsqueda
      const terminoBusqueda = busqueda.toLowerCase().trim();
      if (!terminoBusqueda) return true;

      const coincideNombre = prod.nombre_pieza.toLowerCase().trim().includes(terminoBusqueda);
      if (coincideNombre) return true;

      if (terminoBusqueda.length > 3) {
        const coincideDescripcion = prod.descripcion_pieza?.toLowerCase().trim().includes(terminoBusqueda);
        return coincideDescripcion;
      }

      return false;
    });
  }, [productos, categoriaId, busqueda]);

  // Log los parámetros de la URL cuando cambien
  useEffect(() => {
    console.log('Parámetros de URL:', {
      categoriaId,
      categoriaNombre: categoriaNombre ? decodeURIComponent(categoriaNombre) : null
    });
  }, [categoriaId, categoriaNombre]);

  // Log el resultado del filtrado
  useEffect(() => {
    if (categoriaId) {
      console.log('Productos filtrados:', {
        totalProductos: productos.length,
        productosFiltrados: productosFiltrados.length,
        productos: productosFiltrados.map(p => ({
          nombre: p.nombre_pieza,
          idCategoria: p.id_categoria_pieza
        }))
      });
    }
  }, [categoriaId, productos, productosFiltrados]);

  // Log para debug de la búsqueda
  useEffect(() => {
    if (busqueda) {
      console.log('Término de búsqueda:', busqueda);
      console.log('Productos filtrados:', productosFiltrados.map(p => ({
        nombre: p.nombre_pieza,
        categoria: p.nombre_categoria_pieza,
        descripcion: p.descripcion_pieza
      })));
    }
  }, [busqueda, productosFiltrados]);

  const handleProductClick = (producto) => {
    setSelectedProduct(producto);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const formatearPrecio = (precio) => {
    const precioNum = Number(precio);
    if (isNaN(precioNum)) {
      return '0.00';
    }
    return precioNum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const agregarAlCarrito = async (producto) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe iniciar sesión para agregar productos al carrito',
        confirmButtonColor: '#24487f'
      });
      return;
    }

    try {
      // Verificar stock actualizado antes de agregar
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/productos`);
      
      // Asegurarse de que estamos usando el id_repuesto correcto
      const productoActualizado = response.data.find(p => 
        p.id_repuesto === producto.id_repuesto && 
        p.nombre_pieza === producto.nombre_pieza
      );

      if (!productoActualizado) {
        throw new Error('Producto no encontrado en el catálogo');
      }

      // Convertir a número para asegurar comparación correcta
      const cantidadDisponible = parseInt(productoActualizado.cantidad_pieza);
      
      if (isNaN(cantidadDisponible)) {
        throw new Error('Error al verificar el stock disponible');
      }

      if (cantidadDisponible <= 0) {
        throw new Error(`El producto ${productoActualizado.nombre_pieza} no está disponible actualmente`);
      }

      const carritoKey = `carrito_${userId}`;
      let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

      // Verificar si el producto ya está en el carrito usando id_repuesto y nombre_pieza
      const productoExistente = carrito.find(item => 
        item.id_repuesto === producto.id_repuesto && 
        item.nombre_pieza === producto.nombre_pieza
      );

      if (productoExistente) {
        // Verificar si hay suficiente stock para la cantidad solicitada
        if (productoExistente.cantidad >= cantidadDisponible) {
          throw new Error(`No hay suficiente stock disponible. Stock actual: ${cantidadDisponible}`);
        }
        // Actualizar cantidad y precio
        productoExistente.cantidad += 1;
        productoExistente.precio_pieza = parseFloat(productoActualizado.precio_pieza);
      } else {
        // Agregar nuevo producto con identificación única
        carrito.push({
          id_repuesto: productoActualizado.id_repuesto,
          nombre_pieza: productoActualizado.nombre_pieza,
          precio_pieza: parseFloat(productoActualizado.precio_pieza),
          cantidad: 1,
          imagen_pieza: productoActualizado.imagen_pieza,
          stock_disponible: cantidadDisponible,
          categoria_id: productoActualizado.id_categoria_pieza // Agregar el ID de categoría para mejor identificación
        });
      }

      // Guardar carrito actualizado
      localStorage.setItem(carritoKey, JSON.stringify(carrito));

      // Disparar evento para actualizar el contador del carrito
      window.dispatchEvent(new Event('carritoActualizado'));

      // Mostrar mensaje de éxito con información del stock restante
      await Swal.fire({
        icon: 'success',
        title: '¡Agregado!',
        html: `
          <p>El producto se agregó al carrito</p>
          <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
            Stock disponible: ${cantidadDisponible - 1}
          </p>
        `,
        confirmButtonColor: '#24487f',
        showCancelButton: true,
        confirmButtonText: 'Ir al carrito',
        cancelButtonText: 'Seguir comprando'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/carrito');
        } else {
          navigate('/productos');
        }
      });

    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al agregar el producto al carrito',
        confirmButtonColor: '#24487f'
      });
    }
  };

  return (
    <div className="inicio-container">
      <Sidebar userRole={userRole} />
      <main className="main-content">
        <header className="header">
          <input
            type="text"
            placeholder="Buscar pieza..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscador"
          />
          <HeaderIcons />
        </header>

        <section className="content">
          <div className="productos-section">
            <h2>{categoriaNombre ? `Piezas - ${decodeURIComponent(categoriaNombre)}` : 'Todas las Piezas'}</h2>
            {isLoading ? (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <h3>Cargando productos...</h3>
              </div>
            ) : productosFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <h3>Pieza no encontrada</h3>
                {categoriaId && (
                  <button 
                    onClick={() => navigate('/productos')} 
                    className="btn-agregar"
                    style={{ marginTop: '1rem' }}
                  >
                    Ver todas las piezas
                  </button>
                )}
              </div>
            ) : (
              <div className="productos-grid">
                {productosFiltrados.map((producto) => (
                  <div 
                    key={producto.uniqueKey} 
                    className="producto-card"
                    onClick={() => producto.cantidad_pieza > 0 && handleProductClick(producto)}
                    style={{
                      opacity: producto.cantidad_pieza <= 0 ? '0.5' : '1',
                      cursor: producto.cantidad_pieza <= 0 ? 'not-allowed' : 'pointer',
                      filter: producto.cantidad_pieza <= 0 ? 'grayscale(100%)' : 'none',
                      position: 'relative'
                    }}
                    title={producto.cantidad_pieza <= 0 ? 'Sin piezas' : ''}
                  >
                    <img
                      src={producto.imagen_pieza}
                      alt={producto.nombre_pieza}
                      style={{
                        cursor: producto.cantidad_pieza <= 0 ? 'not-allowed' : 'pointer'
                      }}
                    />
                    <p>{producto.nombre_pieza}</p>
                    <p className="vehiculo-info" style={{ fontSize: '0.9em', color: '#666' }}>
                      {producto.nombre_marca} {producto.nombre_modelo} {producto.anio_vehiculo}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que se active el onClick del div padre
                        producto.cantidad_pieza > 0 && handleProductClick(producto);
                      }}
                      className="btn-ver-pieza"
                      style={{
                        backgroundColor: producto.cantidad_pieza <= 0 ? '#cccccc' : '#24487f',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: producto.cantidad_pieza <= 0 ? 'not-allowed' : 'pointer',
                        marginTop: '10px',
                        width: '100%',
                        opacity: producto.cantidad_pieza <= 0 ? '0.6' : '1'
                      }}
                      disabled={producto.cantidad_pieza <= 0}
                    >
                      {producto.cantidad_pieza <= 0 ? 'Sin Stock' : 'Ver Pieza'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {showModal && selectedProduct && (
        <div className="modal-overlay" key={`modal-${selectedProduct.uniqueKey}`}>
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal} style={{ 
              position: 'absolute', 
              top: '10px', 
              right: '10px', 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              color: '#FF0000',
              fontWeight: 'bold'
            }}>&times;</button>
            <h3>{selectedProduct.nombre_pieza}</h3>
            <img 
              src={selectedProduct.imagen_pieza} 
              alt={selectedProduct.nombre_pieza} 
              style={{ 
                maxWidth: '200px', 
                width: '100%', 
                height: 'auto', 
                objectFit: 'contain',
                margin: '10px auto'
              }} 
            />
            <p className="precio">RD$ {formatearPrecio(selectedProduct.precio_pieza)}</p>
            <p className="descripcion">{selectedProduct.descripcion_pieza}</p>
            <p className="categoria">Categoría: {selectedProduct.nombre_categoria_pieza}</p>
            <p className="vehiculo">Vehículo: {selectedProduct.nombre_marca} {selectedProduct.nombre_modelo} {selectedProduct.anio_vehiculo}</p>
            <p className="anios">Años: {selectedProduct.desde_anio_pieza} - {selectedProduct.hasta_anio_pieza}</p>
            <p className="stock" style={{ color: '#666666', cursor: 'default' }}>Stock disponible: {selectedProduct.cantidad_pieza}</p>
            <button
              onClick={() => {
                agregarAlCarrito(selectedProduct);
                closeModal();
              }}
              className="btn-agregar"
              disabled={selectedProduct.cantidad_pieza <= 0}
              style={{
                backgroundColor: selectedProduct.cantidad_pieza <= 0 ? '#cccccc' : '#007bff',
                cursor: selectedProduct.cantidad_pieza <= 0 ? 'not-allowed' : 'pointer',
                opacity: selectedProduct.cantidad_pieza <= 0 ? '0.6' : '1'
              }}
            >
              {selectedProduct.cantidad_pieza <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}