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
        console.log('Categorías cargadas (detallado):', data.map(cat => ({
          id: cat.id_categoria_pieza,
          nombre: cat.nombre_categoria_pieza
        })));
        setCategorias(data);
      })
      .catch((err) => console.error('Error al obtener categorías:', err));

    // Obtener los productos
    fetch('http://localhost:3000/api/productos')
      .then((res) => res.json())
      .then((data) => {
        console.log('Productos originales:', data.map(prod => ({
          id: prod.id_repuesto,
          nombre: prod.nombre_pieza,
          categoria_actual: prod.id_categoria_pieza
        })));

        // Convertir los precios a números y asegurar que las categorías estén correctamente asignadas
        const productosConPreciosNumericos = data.map(prod => {
          const nuevaCategoria = 
            prod.nombre_pieza.includes('Batería') ? 3 :
            prod.nombre_pieza.includes('Neumático') ? 2 :
            prod.nombre_pieza.includes('Farol') ? 4 :
            prod.nombre_pieza.includes('Pantalla') ? 4 :
            prod.nombre_pieza.includes('Aro') ? 5 :
            prod.nombre_pieza.includes('Gato') ? 6 :
            prod.nombre_pieza.includes('Aceite') ? 7 :
            prod.nombre_pieza.includes('Parachoques') ? 8 :
            prod.nombre_pieza.includes('Sensor') ? 9 :
            prod.nombre_pieza.includes('Amortiguador') ? 10 :
            prod.nombre_pieza.includes('Filtro') ? 11 :
            prod.id_categoria_pieza;

          // Encontrar el nombre de la nueva categoría
          const nombreNuevaCategoria = categorias.find(
            cat => cat.id_categoria_pieza === nuevaCategoria
          )?.nombre_categoria_pieza || '';

          const productoActualizado = {
            ...prod,
            precio_pieza: parseFloat(prod.precio_pieza),
            id_categoria_pieza: nuevaCategoria,
            nombre_categoria_pieza: nombreNuevaCategoria
          };

          console.log(`Producto "${prod.nombre_pieza}": categoría original=${prod.id_categoria_pieza}, nueva categoría=${nuevaCategoria}, nombre categoría=${nombreNuevaCategoria}`);
          
          return productoActualizado;
        });

        console.log('Productos procesados (detallado):', productosConPreciosNumericos.map(prod => ({
          id: prod.id_repuesto,
          nombre: prod.nombre_pieza,
          categoria_final: prod.id_categoria_pieza,
          nombre_categoria: prod.nombre_categoria_pieza
        })));

        setProductos(productosConPreciosNumericos);
      })
      .catch((err) => console.error('Error al obtener productos:', err));
  }, [categorias]);

  const productosFiltrados = productos.filter((prod) => {
    const coincideBusqueda = prod.nombre_pieza?.toLowerCase().includes(busqueda.toLowerCase());
    
    // Si no hay categoría seleccionada, solo filtra por búsqueda
    if (!categoriaFiltro) {
      return coincideBusqueda;
    }

    // Si hay categoría seleccionada, filtra por búsqueda y categoría
    return coincideBusqueda && prod.nombre_categoria_pieza === categoriaFiltro;
  });

  const handleProductClick = (producto) => {
    setSelectedProduct(producto);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    if (typeof precio === 'string') {
      return parseFloat(precio).toFixed(2);
    }
    if (typeof precio === 'number') {
      return precio.toFixed(2);
    }
    return '0.00';
  };

  // Función para agregar al carrito
  const agregarAlCarrito = (producto) => {
    // Obtener el ID del usuario
    const userId = localStorage.getItem('userId');
    if (!userId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes iniciar sesión para agregar productos al carrito',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Iniciar Sesión'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    // Obtener el carrito actual del usuario específico
    const carritoKey = `carrito_${userId}`;
    const carritoActual = JSON.parse(localStorage.getItem(carritoKey)) || [];
    
    // Verificar si el producto ya está en el carrito
    const productoExistente = carritoActual.find(
      item => item.id_repuesto === producto.id_repuesto && 
              item.nombre_pieza === producto.nombre_pieza
    );
    
    let nuevoCarrito;
    if (productoExistente) {
      // Si el producto existe, incrementar la cantidad
      nuevoCarrito = carritoActual.map(item =>
        (item.id_repuesto === producto.id_repuesto && 
         item.nombre_pieza === producto.nombre_pieza)
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      // Si el producto no existe, agregarlo con cantidad 1
      nuevoCarrito = [...carritoActual, { ...producto, cantidad: 1 }];
    }
    
    // Guardar el carrito actualizado
    localStorage.setItem(carritoKey, JSON.stringify(nuevoCarrito));
    
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
            <h2>
              {categoriaFiltro ? `Productos en ${categoriaFiltro}` : 'Todas las Piezas'}
            </h2>
            {productosFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <h3>No se encontraron piezas</h3>
              </div>
            ) : (
              <div className="productos-grid">
                {productosFiltrados.map((prod) => (
                  <div key={`${prod.id_repuesto}-${prod.nombre_pieza}`} className="producto-card">
                    <img 
                      src={prod.imagen_pieza} 
                      alt={prod.nombre_pieza} 
                      onClick={() => handleProductClick(prod)}
                    />
                    <h3>{prod.nombre_pieza}</h3>
                    <p className="precio">RD$ {formatearPrecio(prod.precio_pieza)}</p>
                    <p className="categoria">{prod.nombre_categoria_pieza}</p>
                    <button 
                      className="btn-agregar"
                      onClick={() => agregarAlCarrito(prod)}
                    >
                      Agregar al carrito
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {showModal && selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{selectedProduct.nombre_pieza}</h2>
            <img src={selectedProduct.imagen_pieza} alt={selectedProduct.nombre_pieza} />
            <p><strong>Precio:</strong> RD$ {formatearPrecio(selectedProduct.precio_pieza)}</p>
            <p><strong>Categoría:</strong> {selectedProduct.nombre_categoria_pieza}</p>
            <p><strong>Descripción:</strong> {selectedProduct.descripcion_pieza}</p>
            <p><strong>Años compatibles:</strong> {selectedProduct.desde_anio_pieza} - {selectedProduct.hasta_anio_pieza}</p>
            <p><strong>Stock disponible:</strong> {selectedProduct.cantidad_pieza}</p>
            <button onClick={() => {
              agregarAlCarrito(selectedProduct);
              closeModal();
            }}>
              Agregar al carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}