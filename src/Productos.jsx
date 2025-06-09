import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Productos.css';

export default function Productos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener parámetros de la URL
  const params = new URLSearchParams(location.search);
  const categoriaId = params.get('categoriaId');
  const categoriaNombre = params.get('nombre');

  useEffect(() => {
    setIsLoading(true);
    fetch('http://localhost:3000/api/productos')
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
  
  const agregarAlCarrito = (producto) => {
    if (producto.cantidad_pieza <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Sin stock',
        text: 'Este producto no está disponible actualmente',
        confirmButtonColor: '#24487f'
      });
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    const carritoKey = `carrito_${userId}`;
    const carritoActual = JSON.parse(localStorage.getItem(carritoKey)) || [];
    
    const productoExistente = carritoActual.find(p => p.id_repuesto === producto.id_repuesto);
    
    if (productoExistente) {
      if (productoExistente.cantidad >= producto.cantidad_pieza) {
        Swal.fire({
          icon: 'error',
          title: 'Stock insuficiente',
          text: 'No hay suficiente stock disponible',
          confirmButtonColor: '#24487f'
        });
        return;
      }
      productoExistente.cantidad += 1;
    } else {
      carritoActual.push({
        ...producto,
        cantidad: 1
      });
    }

    localStorage.setItem(carritoKey, JSON.stringify(carritoActual));

    Swal.fire({
      icon: 'success',
      title: '¡Agregado!',
      text: 'El producto se agregó al carrito',
      confirmButtonColor: '#24487f',
      showCancelButton: true,
      confirmButtonText: 'Ir al carrito',
      cancelButtonText: 'Seguir comprando'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/carrito');
      }
    });
  };

  return (
    <div className="inicio-container">
      <div className="sidebar">
        <div className="logo-wrapper" onClick={() => navigate('/inicio_client')}>
          <img src="/Logo.png" alt="Logo" />
        </div>
        <ul>
          <li onClick={() => navigate('/inicio_client')}>Inicio</li>
          <li onClick={() => navigate('/productos')}>Piezas</li>
          <li onClick={() => navigate('/pedidos')}>Pedidos</li>
          <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
        </ul>
      </div>

      <main className="main-content">
        <header className="header">
          <input
            type="text"
            placeholder="Buscar pieza..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscador"
          />
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
                  <div key={producto.uniqueKey} className="producto-card">
                    <img
                      src={producto.imagen_pieza}
                      alt={producto.nombre_pieza}
                      onClick={() => handleProductClick(producto)}
                    />
                    <p>{producto.nombre_pieza}</p>
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
            <button className="close-modal" onClick={closeModal}>&times;</button>
            <h3>{selectedProduct.nombre_pieza}</h3>
            <img src={selectedProduct.imagen_pieza} alt={selectedProduct.nombre_pieza} />
            <p className="precio">RD$ {formatearPrecio(selectedProduct.precio_pieza)}</p>
            <p className="descripcion">{selectedProduct.descripcion_pieza}</p>
            <p className="categoria">Categoría: {selectedProduct.nombre_categoria_pieza}</p>
            <p className="anios">Años: {selectedProduct.desde_anio_pieza} - {selectedProduct.hasta_anio_pieza}</p>
            <p className="stock">Stock disponible: {selectedProduct.cantidad_pieza}</p>
            <button
              onClick={() => {
                agregarAlCarrito(selectedProduct);
                closeModal();
              }}
              className="btn-agregar"
              disabled={selectedProduct.cantidad_pieza <= 0}
            >
              {selectedProduct.cantidad_pieza <= 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}