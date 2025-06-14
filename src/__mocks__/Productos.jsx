import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Productos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };
    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    const carritoActual = JSON.parse(localStorage.getItem('carrito') || '[]');
    const productoEnCarrito = carritoActual.find(item => item.id_repuesto === producto.id_repuesto);

    if (productoEnCarrito) {
      if (productoEnCarrito.cantidad >= parseInt(producto.cantidad_pieza)) {
        Swal.fire({
          title: 'Error',
          text: 'No hay suficiente stock disponible',
          icon: 'error'
        });
        return;
      }
      productoEnCarrito.cantidad += 1;
    } else {
      carritoActual.push({
        ...producto,
        cantidad: 1
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carritoActual));
    Swal.fire({
      title: '¡Éxito!',
      text: '¡Producto agregado al carrito!',
      icon: 'success'
    });
  };

  const formatearPrecio = (precio) => {
    return `$${parseFloat(precio).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div data-testid="productos-component">
      <h1>Productos</h1>
      <div className="productos-grid">
        {productos.map(producto => (
          <div key={producto.id_repuesto} className="producto-card" data-testid={`producto-${producto.id_repuesto}`}>
            <h3>{producto.nombre_pieza}</h3>
            <p>Precio: {formatearPrecio(producto.precio_pieza)}</p>
            <p>Stock: {producto.cantidad_pieza}</p>
            <button onClick={() => agregarAlCarrito(producto)}>Agregar al Carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos; 