import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio_Client.css'; // Asegúrate de tener este archivo CSS para estilos

export default function Inicio_Client() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Función para obtener las categorías desde el backend
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/categorias');
        const data = await response.json();
        
        // Mapeamos los datos de la base de datos con las imágenes locales
        const categoriasConImagenes = data.map((cat, index) => ({
          nombre: cat.nombre_categoria_pieza,
          descripcion: cat.descripcion_categoria_pieza,
          imagen: [
            '/Neumatico.png',
            '/bateria.jpg',
            '/pantallasmicas.png',
            '/aros.png',
            '/gato.png',
            '/lubricante.png',
            '/carroceria.png',
            '/electricas.png',
            '/amortiguadores.png',
            '/filtros.png'
          ][index % 10], // Usamos módulo para evitar desbordamiento
          ruta: cat.nombre_categoria_pieza.toLowerCase().replace(/\s+/g, '_')
        }));
        
        setCategorias(categoriasConImagenes);
      } catch (error) {
        console.error('Error al obtener categorías:', error);
      }
    };

    fetchCategorias();
  }, []);

  const categoriasFiltradas = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleCategoryClick = (cat) => {
    if (selectedCategory && selectedCategory.nombre === cat.nombre) {
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
          <li onClick={() => navigate('/inicio_client')}>Inicio</li>
          <li onClick={() => navigate('/productos')}>Piezas</li>
          <li onClick={() => navigate('/pedidos')}>Pedidos</li>
          <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li>
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
            <img
              src="/carrito.png"
              alt="Carrito"
              className="cart-img"
              onClick={() => navigate('/carrito')}
            />
            <img
              src="/perfil.png"
              alt="Perfil"
              className="perfil-img"
              onClick={() => navigate('/perfil')}
            />
          </div>
        </header>

        <section className="content">
          <div className="repuestos-section">
            <h2>Categorías</h2>
            <div className="categorias-grid">
              {categoriasFiltradas.map((cat) => (
                <div
                  key={cat.nombre}
                  className="categoria-card"
                  onClick={() => handleCategoryClick(cat)}
                >
                  <img src={cat.imagen} alt={cat.nombre} />
                  <p>{cat.nombre}</p>
                </div>
              ))}
            </div>

            {selectedCategory && (
              <div className="category-details">
                <h3>{selectedCategory.nombre}</h3>
                <p>{selectedCategory.descripcion}</p>
                <button 
                  className="ver-productos-btn"
                  onClick={() => navigate(`/repuestos/${selectedCategory.ruta}`)}
                >
                  Ver productos
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}