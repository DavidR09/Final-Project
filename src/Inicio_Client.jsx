import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartIcon from './components/CartIcon';
import './Inicio_Client.css';
import './styles/global.css';

export default function Inicio_Client() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [stockPorCategoria, setStockPorCategoria] = useState({});

  useEffect(() => {
    // Verificar el rol del usuario
    const checkUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No hay token de autenticación');
          return;
        }

        const response = await fetch('https://backend-respuestosgra.up.railway.app/api/auth/check-auth', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error en la verificación de autenticación');
        }

        const data = await response.json();
        console.log('Datos de autenticación:', data);
        
        if (data.authenticated && data.rol) {
          setUserRole(data.rol);
          localStorage.setItem('userRole', data.rol);
        } else {
          console.log('Usuario no autenticado o sin rol');
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error al verificar el rol:', error);
        setUserRole(null);
      }
    };

    checkUserRole();

    // Función para obtener las categorías desde el backend
    const fetchCategorias = async () => {
      try {
        const [categoriasResponse, productosResponse] = await Promise.all([
          fetch('https://backend-respuestosgra.up.railway.app/api/categorias'),
          fetch('https://backend-respuestosgra.up.railway.app/api/productos')
        ]);

        const categoriasData = await categoriasResponse.json();
        const productosData = await productosResponse.json();

        // Calcular stock por categoría
        const stockCategoria = {};
        productosData.forEach(producto => {
          if (producto.cantidad_pieza > 0) {
            stockCategoria[producto.id_categoria_pieza] = (stockCategoria[producto.id_categoria_pieza] || 0) + 1;
          }
        });

        setStockPorCategoria(stockCategoria);

        // Mapeamos los datos de la base de datos con las imágenes locales
        const imagenes = {
          2: '/Neumatico.png',    // Neumáticos
          3: '/bateria.jpg',      // Baterías
          4: '/pantallasmicas.png', // Faroles y pantallas
          5: '/aros.png',         // Aros
          6: '/gato.png',         // Gatos
          7: '/lubricante.png',   // Lubricantes
          8: '/carroceria.png',   // Carrocerías
          9: '/electricas.png',   // Eléctricos
          10: '/amortiguadores.png', // Amortiguadores
          11: '/filtros.png'      // Filtros
        };

        const categoriasConImagenes = categoriasData.map((cat) => {
          return {
            ...cat,
            imagen: imagenes[cat.id_categoria_pieza] || '/default.png'
          };
        });
        
        console.log('Categorías cargadas:', categoriasConImagenes.map(cat => ({
          id: cat.id_categoria_pieza,
          nombre: cat.nombre_categoria_pieza
        })));
        
        setCategorias(categoriasConImagenes);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  const categoriasFiltradas = categorias.filter(cat =>
    cat.nombre_categoria_pieza.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleCategoryClick = (cat) => {
    if (selectedCategory && selectedCategory.nombre_categoria_pieza === cat.nombre_categoria_pieza) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(cat);
    }
  };

  return (
    <div className="inicio-container">
      <aside className="sidebar">
        <div className="logo-wrapper" onClick={() => navigate('/inicio_client')}>
          <img src="/Logo.png" alt="Logo" />
        </div>
        <ul>
          {userRole === 'administrador' ? (
            <>
              <li onClick={() => navigate('/inicio_client')}>Inicio</li>
              <li onClick={() => navigate('/productos')}>Piezas</li>
              <li onClick={() => navigate('/pedidos')}>Pedidos</li>
              <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
              <li onClick={() => navigate('/Inicio')}>Volver al Panel Admin</li>
            </>
          ) : (
            <>
              <li onClick={() => navigate('/inicio_client')}>Inicio</li>
              <li onClick={() => navigate('/productos')}>Piezas</li>
              <li onClick={() => navigate('/pedidos')}>Pedidos</li>
              <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
            </>
          )}
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="buscador"
          />
          <div className="iconos-header">
            <CartIcon />
            <img
              src="/perfil.png"
              alt="Perfil"
              onClick={() => navigate('/perfil')}
            />
          </div>
        </header>

        <section className="content">
          <div className="productos-section">
            <h2>Categorías</h2>
            {categoriasFiltradas.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <h3>Categoría no encontrada</h3>
              </div>
            ) : (
              <div className="productos-grid">
                {categoriasFiltradas.map((cat) => (
                  <div key={cat.id_categoria_pieza} className="producto-card">
                    <img 
                      src={cat.imagen} 
                      alt={cat.nombre_categoria_pieza} 
                      onClick={() => handleCategoryClick(cat)}
                    />
                    <p>{cat.nombre_categoria_pieza}</p>
                    <button 
                      className="btn-agregar"
                      onClick={() => {
                        // Asegurarnos de que estamos usando el ID correcto
                        const idCategoria = cat.id_categoria_pieza;
                        console.log('Datos de navegación:', {
                          categoriaCompleta: cat,
                          id_categoria_pieza: idCategoria,
                          nombre_categoria: cat.nombre_categoria_pieza,
                          url: `/productos?categoriaId=${idCategoria}&nombre=${encodeURIComponent(cat.nombre_categoria_pieza)}`
                        });
                        navigate(`/productos?categoriaId=${idCategoria}&nombre=${encodeURIComponent(cat.nombre_categoria_pieza)}`);
                      }}
                      style={{
                        backgroundColor: !stockPorCategoria[cat.id_categoria_pieza] ? '#cccccc' : '#24487f',
                        cursor: !stockPorCategoria[cat.id_categoria_pieza] ? 'not-allowed' : 'pointer',
                        opacity: !stockPorCategoria[cat.id_categoria_pieza] ? '0.6' : '1'
                      }}
                      disabled={!stockPorCategoria[cat.id_categoria_pieza]}
                    >
                      {!stockPorCategoria[cat.id_categoria_pieza] ? 'Sin Productos' : 'Ver Productos'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedCategory && (
              <div className="category-details">
                <h3>{selectedCategory.nombre_categoria_pieza}</h3>
                <p>{selectedCategory.descripcion_categoria_pieza}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}