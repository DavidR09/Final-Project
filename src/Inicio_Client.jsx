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
        
        console.log('Datos originales de categorías:', data);
        
        // Mapeamos los datos de la base de datos con las imágenes locales
        const categoriasConImagenes = data.map((cat, index) => ({
          ...cat,
          id_categoria_pieza: index + 1, // ID secuencial empezando en 1
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
          ][index % 10]
        }));
        
        console.log('Categorías con IDs asignados:', categoriasConImagenes.map(cat => ({
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
          <div className="productos-section">
            <h2>Categorías</h2>
            {categoriasFiltradas.length === 0 ? (
              <p style={{ textAlign: 'center', marginTop: '3rem' }}><h3>Categoría no encontrada</h3></p>
            ) : (
              <div className="productos-grid">
                {categoriasFiltradas.map((cat) => (
                  <div key={cat.nombre_categoria_pieza} className="producto-card">
                    <img 
                      src={cat.imagen} 
                      alt={cat.nombre_categoria_pieza} 
                      onClick={() => handleCategoryClick(cat)}
                    />
                    <p>{cat.nombre_categoria_pieza}</p>
                    <button 
                      className="btn-agregar"
                      onClick={() => {
                        console.log('Navegando a categoría (datos completos):', {
                          categoria: cat,
                          nombre: cat.nombre_categoria_pieza,
                          id: cat.id_categoria_pieza
                        });
                        navigate(`/productos?categoria=${encodeURIComponent(cat.nombre_categoria_pieza)}`);
                      }}
                    >
                      Ver productos
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