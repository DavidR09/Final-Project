import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './productos.css';

export default function Productos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Obtener la categoría de los parámetros de URL
  const searchParams = new URLSearchParams(location.search);
  const categoriaFiltro = searchParams.get('categoria');

  useEffect(() => {
    // Obtener las categorías
    fetch('http://localhost:3000/api/categorias')
      .then((res) => res.json())
      .then((data) => {
        console.log('=== DATOS DE CATEGORÍAS ===');
        if (data.length > 0) {
          console.log('Estructura de la primera categoría:');
          console.log(JSON.stringify(data[0], null, 2));
          console.log('Propiedades disponibles en categoría:', Object.keys(data[0]));
        }
        setCategorias(data);
      })
      .catch((err) => console.error('Error al obtener categorías:', err));

    // Obtener los productos
    fetch('http://localhost:3000/api/productos')
      .then((res) => res.json())
      .then((data) => {
        console.log('=== DATOS DE PRODUCTOS ===');
        if (data.length > 0) {
          console.log('Estructura del primer producto:');
          console.log(JSON.stringify(data[0], null, 2));
          console.log('Propiedades disponibles en producto:', Object.keys(data[0]));
        }
        setProductos(data);
      })
      .catch((err) => console.error('Error al obtener productos:', err));
  }, []);

  useEffect(() => {
    console.log('=== ESTADO ACTUAL ===');
    console.log('Categorías en estado:', categorias);
    console.log('Productos en estado:', productos);
    console.log('Categoría a filtrar:', categoriaFiltro);
  }, [categorias, productos, categoriaFiltro]);

  const productosFiltrados = productos.filter((prod) => {
    const coincideBusqueda = prod.nombre_pieza?.toLowerCase().includes(busqueda.toLowerCase());
    
    // Encontrar la categoría del producto basándonos en el id_categoria_pieza
    const idCategoria = prod.id_categoria_pieza;
    
    // Mapeo de IDs a nombres de categorías
    const mapeoCategoriasId = {
      1: 'Neumáticos',
      2: 'Baterías de Carro',
      3: 'Faroles y pantallas',
      4: 'Aros',
      5: 'Gatos',
      6: 'Lubricantes',
      7: 'Carrocerías',
      8: 'Eléctricos',
      9: 'Amortiguadores',
      10: 'Filtros de aceite'
    };

    const nombreCategoriaProducto = mapeoCategoriasId[idCategoria];

    console.log('Comparación de categorías:', {
      id_categoria: idCategoria,
      nombre_categoria_producto: nombreCategoriaProducto,
      categoria_filtro: categoriaFiltro,
      coincide: nombreCategoriaProducto?.toLowerCase() === categoriaFiltro?.toLowerCase()
    });

    const coincideCategoria = !categoriaFiltro || 
                            nombreCategoriaProducto?.toLowerCase() === categoriaFiltro?.toLowerCase();
    
    return coincideBusqueda && coincideCategoria;
  });

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