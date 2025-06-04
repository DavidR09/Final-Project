import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './productos.css';
import Swal from 'sweetalert2';


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
        console.log('=== CATEGORÍAS DISPONIBLES ===');
        // Asignar IDs específicos según la base de datos
        const categoriasConId = data.map((cat, index) => ({
          ...cat,
          id_categoria_pieza: [3, 2, 4, 6, 7, 8, 9, 5, 11, 10][index]
        }));
        console.log('Categorías con IDs:', categoriasConId.map(cat => ({
          id: cat.id_categoria_pieza,
          nombre: cat.nombre_categoria_pieza
        })));
        setCategorias(categoriasConId);
      })
      .catch((err) => console.error('Error al obtener categorías:', err));

    // Obtener los productos
    fetch('http://localhost:3000/api/productos')
      .then((res) => res.json())
      .then((data) => {
        console.log('=== PRODUCTOS Y SUS CATEGORÍAS ===');
        // Mapear los productos con sus IDs de categoría correctos
        const productosConCategoriasCorrectas = data.map(prod => {
          const categoriaMap = {
            'Baterías de Carro': 2,
            'Neumáticos': 3,
            'Faroles y pantallas': 4,
            'Eléctricos': 6,
            'Aros': 7,
            'Gatos': 8,
            'Lubricantes': 9,
            'Carrocerías': 5,
            'Filtros de aceite': 11,
            'Amortiguadores': 10
          };
          
          return {
            ...prod,
            id_categoria_pieza: categoriaMap[prod.nombre_categoria_pieza] || prod.id_categoria_pieza
          };
        });
        
        setProductos(productosConCategoriasCorrectas);
        
        // Log para depuración
        productosConCategoriasCorrectas.forEach(prod => {
          console.log(`${prod.nombre_pieza}:`, {
            categoria: prod.nombre_categoria_pieza,
            id_categoria: prod.id_categoria_pieza
          });
        });
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
    
    // Encontrar el ID de la categoría que estamos buscando
    const categoriaFiltrada = categorias.find(cat => 
      cat.nombre_categoria_pieza === categoriaFiltro
    );

    console.log('Filtrado:', {
      producto: prod.nombre_pieza,
      categoria_actual: prod.id_categoria_pieza,
      categoria_buscada: categoriaFiltro,
      id_categoria_buscada: categoriaFiltrada?.id_categoria_pieza
    });

    const coincideCategoria = !categoriaFiltro || 
                            prod.id_categoria_pieza === categoriaFiltrada?.id_categoria_pieza;
    
    return coincideBusqueda && coincideCategoria;
  });

  const handleProductClick = (producto) => {
    setSelectedProduct(producto);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Función para agregar al carrito
  const agregarAlCarrito = (producto) => {
    // Obtener el carrito actual del localStorage
    const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Verificar si el producto ya está en el carrito
    const productoExistente = carritoActual.find(item => item.id_repuesto === producto.id_repuesto);
    
    let nuevoCarrito;
    if (productoExistente) {
      // Si el producto existe, incrementar la cantidad
      nuevoCarrito = carritoActual.map(item =>
        item.id_repuesto === producto.id_repuesto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      // Si el producto no existe, agregarlo con cantidad 1
      nuevoCarrito = [...carritoActual, { ...producto, cantidad: 1 }];
    }
    
    // Guardar el carrito actualizado
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    
    Swal.fire({
      icon: 'success',
      title: '¡Agregado!',
      text: 'Producto agregado al carrito',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK'
    });
        // Opcional: navegar al carrito
    navigate('/carrito');
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
            <img 
              src="/carrito.png" 
              className="cart-img" 
              alt="Carrito" 
              onClick={() => navigate('/carrito')}
            />
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
            <button 
              className="btn-agregar"
              onClick={() => agregarAlCarrito(prod)}
            >
              Agregar
            </button>
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

                <button 
                  className="modal-add-btn"
                  onClick={() => {
                    agregarAlCarrito(selectedProduct);
                    closeModal();
                  }}
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}