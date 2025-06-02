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
        <div
          className="logo-wrapper"
          onClick={() => navigate('/inicio_client')}
        >
          <img src="/Logo.png" alt="Logo" />
        </div>

        <ul>
          <li onClick={() => navigate('/inicio_client')}>Inicio</li>
          <li onClick={() => navigate('/pedidos')}>Pedidos</li>
          <li onClick={() => navigate('/perfil')}>Perfil</li>
          <li onClick={() => navigate('/carrito')}>
            
            <img src="/carrito.png" alt="Carrito" className="icon-img" />
            Carrito
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <section className="carrito-section">
          <table className="carrito-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <img src={prod.imagen} alt={prod.nombre} className="product-img" />
                  </td>
                  <td>{prod.nombre}</td>
                  <td>{prod.cantidad}</td>
                  <td>${prod.precio}</td>
                  <td>${prod.precio * prod.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="detalle-compra">
            <h3 className="detalle-title">Resumen</h3>
            <p className="total">Total: ${total}</p>
            <button className="confirmar-btn">Confirmar Compra</button>
            <p className="vuelva">Gracias por tu visita</p>
          </div>
        </section>
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

        .carrito-section {
          display: flex;
          padding: 20px;
          gap: 30px;
          background-color: #ffffff;
          color: black;
        }

        .carrito-table {
          flex: 3;
          width: 100%;
          border-collapse: collapse;
          background-color: #f5f5f5;
        }

        .carrito-table thead {
          background-color: #24487f;
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

        .detalle-compra {
          flex: 1;
          border: 1px solid #ddd;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
          text-align: center;
        }

        .detalle-title {
          color: #24487f;
          margin-bottom: 10px;
        }

        .total {
          font-size: 24px;
          margin: 10px 0;
        }

        .confirmar-btn {
          background-color: #24487f;
          color: white;
          border: none;
          padding: 10px 20px;
          font-size: 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        .confirmar-btn:hover {
          background-color: #1b355b;
        }

        .vuelva {
          margin-top: 20px;
          color: #666;
        }
      `}</style>
    </div>
  );
}
