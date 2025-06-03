/* import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Productos() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  const productos = [
    { nombre: 'Aceite de motor', imagen: '/public/lubricante.png' },
    { nombre: 'Filtro de aire', imagen: '/public/filtros.png' },
    { nombre: 'Batería Bosch', imagen: '/bateria.jpg' },
    { nombre: 'Neumático Goodyear', imagen: '/Neumatico.png' },
    { nombre: 'Amortiguador trasero', imagen: '/amortiguadores.png' },
  ];

  const productosFiltrados = productos.filter((prod) =>
    prod.nombre.toLowerCase().includes(busqueda.toLowerCase())
  ); */

import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './productos.css';

export default function Productos() {
  const navigate = useNavigate(); 
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error al obtener productos:', err));
  }, []);

  const productosFiltrados = productos.filter((prod) =>
    prod.nombre_pieza?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleProductClick = (producto) => {
    setSelectedProduct(producto);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="inicio-container">
      {/* Sidebar igual al de Inicio_Client */}
      <div className="sidebar">
        <div className="logo-wrapper" onClick={() => navigate('/inicio_client')}>
          <img src="/Logo.png" alt="Logo" />
        </div>
        <ul>
          <li onClick={() => navigate('/inicio_client')}>Inicio</li>
          <li onClick={() => navigate('/productos')}>Piezas</li>
          <li onClick={() => navigate('/pedidos')}>Pedidos</li>
          <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
          {/* Agrega más opciones si lo necesitas */}
        </ul>
      </div>

      {/* Main content igual al de Inicio_Client */}
      <div className="main-content">
        <div className="header">
          <input
            type="text"
            className="buscador"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="iconos-header">
            <img src="/carrito.png" className="cart-img" alt="Carrito" />
            <img src="/perfil.png" className="perfil-img" alt="Perfil" />
          </div>
        </div>

       <section className="content">
  <div className="productos-section">
    <h2>Piezas Disponibles</h2>
    {productosFiltrados.length === 0 ? (
      <p style={{ textAlign: 'center', marginTop: '3rem' }}><h3>Pieza no encontrada</h3></p>
    ) : (
      <div className="productos-grid">
        {productosFiltrados.map((prod, index) => (
          <div key={index} className="producto-card">
            <img 
              src={prod.imagen_pieza} 
              alt={prod.nombre_pieza} 
              onClick={() => handleProductClick(prod)}
            />
            <p>{prod.nombre_pieza}</p>
            <button className="btn-agregar">Agregar</button>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>×</button>
            <h2 className="modal-title">{selectedProduct.nombre_pieza}</h2>

            <div className="modal-body">
              <div className="modal-image-container">
                <img
                  src={selectedProduct.imagen_pieza}
                  alt={selectedProduct.nombre_pieza}
                  className="modal-image"
                />
              </div>

              <div className="modal-info">
                <div className="info-section">
                  <h3>Descripción</h3>
                  <p>{selectedProduct.descripcion_pieza || 'No disponible'}</p>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Precio:</span>
                    <span className="info-value">${selectedProduct.precio_pieza}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Disponibles:</span>
                    <span className="info-value">{selectedProduct.cantidad_pieza} unidades</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Años:</span>
                    <span className="info-value">
                      {selectedProduct.desde_anio_pieza} - {selectedProduct.hasta_anio_pieza}
                    </span>
                  </div>
                </div>

                <button className="modal-add-btn">Añadir al carrito</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}