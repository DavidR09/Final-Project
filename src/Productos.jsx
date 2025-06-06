import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Productos.css';

export default function Productos() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los productos'
      });
    }
  };

  const handleProductClick = (producto) => {
    setSelectedProduct(producto);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const formatearPrecio = (precio) => {
    return precio.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            <div className="productos-grid">
              {productos
                .filter(prod => 
                  prod.nombre_pieza?.toLowerCase().includes(busqueda.toLowerCase()) ||
                  prod.descripcion_pieza?.toLowerCase().includes(busqueda.toLowerCase())
                )
                .map((producto) => (
                  <div key={producto.id_repuesto} className="producto-card">
                    <img
                      src={producto.imagen_pieza}
                      alt={producto.nombre_pieza}
                      onClick={() => handleProductClick(producto)}
                    />
                    <p>{producto.nombre_pieza}</p>
                    <p className="precio">RD$ {formatearPrecio(producto.precio_pieza)}</p>
                    <button
                      onClick={() => agregarAlCarrito(producto)}
                      className="btn-agregar"
                      disabled={producto.cantidad_pieza <= 0}
                    >
                      {producto.cantidad_pieza <= 0 ? 'Sin stock' : 'Agregar al carrito'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>

      {showModal && selectedProduct && (
        <div className="modal-overlay">
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