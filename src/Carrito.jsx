import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Carrito() {
  const navigate = useNavigate();

  const productos = [
    { id: 1, nombre: 'Lorem ipsum.', cantidad: 6, precio: 66, imagen: '/zapatilla.jpg' },
    { id: 2, nombre: 'Lorem ipsum.', cantidad: 7, precio: 36, imagen: '/zapatilla.jpg' },
    { id: 3, nombre: 'Lorem ipsum.', cantidad: 1, precio: 16, imagen: '/zapatilla.jpg' },
  ];

  const total = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <div className="main-container">
      <aside className="sidebar">
        <h2>Menú</h2>
        <ul>
          <li onClick={() => navigate('/inicio')}>Inicio</li>
          <li onClick={() => navigate('/perfil')}>Perfil</li>
          <li onClick={() => navigate('/carrito')}>
            <img src="/carrito.png" alt="Carrito" className="icon-img" />
            Carrito
          </li>
          <li onClick={() => navigate('/')}>Cerrar sesión</li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="header">
          <img
            src="/carrito.png"
            alt="Carrito"
            className="cart-img"
            onClick={() => navigate('/carrito')}
          />
        </header>

        <div className="carrito-section">
          <table className="carrito-table">
            <thead>
              <tr>
                <th>Nombre Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Foto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.cantidad}</td>
                  <td>{p.precio} $</td>
                  <td>
                    <img src={p.imagen} alt="Producto" className="product-img" />
                  </td>
                  <td>
                    <button className="btn delete">🗑</button>
                    <button className="btn add">➕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="detalle-compra">
            <h4 className="detalle-title">Detalle Compra</h4>
            <h2>Total</h2>
            <p className="total">{total} $</p>
            <button className="confirmar-btn">Confirmar Compra</button>
            <p className="vuelva">Vuelva pronto</p>
          </div>
        </div>
      </main>

      <style jsx>{`
        .main-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          background-color: #fff;
        }

        .sidebar {
          width: 250px;
          background-color: #2a2829;
          color: white;
          padding: 20px;
        }

        .sidebar ul {
          list-style: none;
          padding: 0;
        }

        .sidebar li {
          margin-bottom: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 5px;
        }

        .sidebar li:hover {
          background-color: #333;
        }

        .icon-img {
          width: 18px;
          height: 18px;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          justify-content: flex-end;
          padding: 20px;
          background-color: #2b2b2b;
        }

        .cart-img {
          width: 30px;
          height: 30px;
          cursor: pointer;
        }

        .carrito-section {
          display: flex;
          padding: 20px;
          gap: 30px;
        }

        .carrito-table {
          flex: 3;
          width: 100%;
          border-collapse: collapse;
          background-color:#b2b2b3
        }

        .carrito-table thead {
          background-color:#1f1f1f;
          color: white;
        }

        .carrito-table th,
        .carrito-table td {
          padding: 15px;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }

        .product-img {
          width: 60px;
          height: 60px;
          border-radius: 10px;
        }

        .btn {
          background-color: #d9534f;
          color: white;
          border: none;
          padding: 6px 10px;
          margin: 0 2px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }

        .btn:hover {
          background-color: #c9302c;
        }

        .detalle-compra {
          flex: 1;
          border: 1px solid #ddd;
          padding: 20px;
          background-color:#b2b2b3;
          border-radius: 8px;
          text-align: center;
        }

        .detalle-title {
          color: #d9534f;
          margin-bottom: 10px;
        }

        .total {
          font-size: 24px;
          margin: 10px 0;
        }

        .confirmar-btn {
          background-color: #d9534f;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .confirmar-btn:hover {
          background-color: #c9302c;
        }

        .vuelva {
          margin-top: 20px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
}
