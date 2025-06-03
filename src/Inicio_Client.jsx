import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio_Client.css';

export default function Inicio_Client() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // Cargar categorías del backend
  useEffect(() => {
    // Asociar imágenes locales con nombres
    const imagenes = {
      'Baterías De Carro': '/bateria.jpg',
      'Neumáticos': '/Neumatico.png',
      'Faroles y Pantallas': '/pantallasmicas.png',
      'Aros': '/aros.png',
      'Gatos': '/gato.png',
      'Lubricantes': '/lubricante.png',
      'Carrocerías': '/carroceria.png',
      'Eléctricos': '/electricas.png',
      'Amortiguadores': '/amortiguadores.png',
      'Filtros De aceite': '/filtros.png',
    };

    fetch('http://localhost:3000/api/categorias')
      .then(res => res.json())
      .then(data => {
        const categoriasConImagen = data.map(cat => ({
          ...cat,
          imagen: imagenes[cat.nombre_categoria_pieza] || '/default.png',
        }));
        setCategorias(categoriasConImagen);
      })
      .catch(err => console.error('Error cargando categorías:', err));
  }, []);

  // Filtro por búsqueda
  const categoriasFiltradas = categorias.filter(cat =>
    cat.nombre_categoria_pieza.toLowerCase().includes(busqueda.toLowerCase())
  );

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
            <img src="/carrito.png" alt="Carrito" className="cart-img" onClick={() => navigate('/carrito')} />
            <img src="/perfil.png" alt="Perfil" className="perfil-img" onClick={() => navigate('/perfil')} />
          </div>
        </header>

        <section className="content">
          <div className="repuestos-section">
            <h2>Categoría</h2>
            <div className="categorias-grid">
              {categoriasFiltradas.map((cat) => (
                <div
                  key={cat.id_categoria_pieza}
                  className="categoria-card"
                  onClick={() => setCategoriaSeleccionada(cat)}
                >
                  <img src={cat.imagen} alt={cat.nombre_categoria_pieza} />
                  <p>{cat.nombre_categoria_pieza}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

            {/* Ventana emergente con la información de la categoría */}
      {categoriaSeleccionada && (
        <div className="modal-overlay" onClick={() => setCategoriaSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{categoriaSeleccionada.nombre_categoria_pieza}</h3>
            <p>{categoriaSeleccionada.descripcion_categoria_pieza}</p>
            <button onClick={() => setCategoriaSeleccionada(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

{/* import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Inicio_Client() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  const categorias = [
    { nombre: 'Neumáticos', imagen: '/Neumatico.png', ruta: 'neumaticos' },
    { nombre: 'Baterías De Carro', imagen: '/bateria.jpg', ruta: 'baterias' },
    { nombre: 'Faroles y Pantallas', imagen: '/pantallasmicas.png', ruta: 'faroles' },
    { nombre: 'Aros', imagen: '/aros.png', ruta: 'aros' },
    { nombre: 'Gatos', imagen: '/gato.png', ruta: 'gatos' },
    { nombre: 'Lubricantes', imagen: '/lubricante.png', ruta: 'lubricantes' },
    { nombre: 'Carrocerías', imagen: '/carroceria.png', ruta: 'carrocerias' },
    { nombre: 'Eléctricos', imagen: '/electricas.png', ruta: 'electricos' },
    { nombre: 'Amortiguadores', imagen: '/amortiguadores.png', ruta: 'amortiguadores' },
    { nombre: 'Filtros De aceite', imagen: '/filtros.png', ruta: 'filtros_aceite' },
  ];

  const categoriasFiltradas = categorias.filter(cat =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

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
          <li onClick={() => navigate('/contacto')}>Sobre Nosotros</li> */
          {/* ¡Sin botón de registro aquí! */}
     /*   </ul>
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
            <h2>Categoría</h2>
            <div className="categorias-grid">
              {categoriasFiltradas.map((cat) => (
                <div
                  key={cat.nombre}
                  className="categoria-card"
                  onClick={() => navigate(`/repuestos/${cat.ruta}`)}
                >
                  <img src={cat.imagen} alt={cat.nombre} />
                  <p>{cat.nombre}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main> 

           <style jsx>{`
        .inicio-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          background-color: #ffffff;
        }

        .sidebar {
          width: 250px;
          background-color: #24487f;
          color: white;
          padding: 20px;
        }

        .logo-wrapper {
          width: 120px;
          height: 120px;
          background-color: white;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .logo-wrapper img {
          width: 90%;
          height: 90%;
          object-fit: contain;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
        }

        .sidebar li {
          margin-bottom: 15px;
          cursor: pointer;
          padding: 8px;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .sidebar li:hover {
          background-color: #333;
        }

        .sidebar li:active {
          background-color: #1b355b;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background-color: #24487f;
          flex-wrap: wrap;
        }

        .buscador {
          padding: 10px 15px;
          width: 300px;
          border: none;
          border-radius: 25px;
          font-size: 16px;
          color: #24487f;
          background-color: white;
          outline: none;
        }

        .iconos-header {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .cart-img,
        .perfil-img {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }

        .perfil-img {
          border-radius: 50%;
          object-fit: cover;
        }

        .cart-img:hover,
        .perfil-img:hover {
          filter: brightness(1.2);
        }

        .content {
          padding: 20px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow-y: auto;
          background-color: #ffffff;
          color: black;
        }

        .repuestos-section {
          text-align: center;
          width: 100%;
        }

        .repuestos-section h2 {
          font-size: 28px;
          margin-bottom: 20px;
          color: #333333;
        }

        .categorias-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 30px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .categoria-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .categoria-card img {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }

        .categoria-card p {
          margin-top: 10px;
          font-weight: bold;
          text-align: center;
          color: black;
        }

        .categoria-card:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
*/}
