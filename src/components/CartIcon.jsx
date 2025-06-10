import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CartIcon() {
  const navigate = useNavigate();
  const [cantidadProductos, setCantidadProductos] = useState(0);

  useEffect(() => {
    const actualizarCantidadCarrito = () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const carritoKey = `carrito_${userId}`;
        const carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];
        setCantidadProductos(carrito.length);
      } else {
        setCantidadProductos(0);
      }
    };

    // Actualizar inicialmente
    actualizarCantidadCarrito();

    // Escuchar cambios en el localStorage
    window.addEventListener('storage', actualizarCantidadCarrito);

    // Crear un evento personalizado para actualizar el carrito
    window.addEventListener('carritoActualizado', actualizarCantidadCarrito);

    return () => {
      window.removeEventListener('storage', actualizarCantidadCarrito);
      window.removeEventListener('carritoActualizado', actualizarCantidadCarrito);
    };
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src="/carrito.png"
        alt="Carrito"
        onClick={() => navigate('/carrito')}
        style={{ cursor: 'pointer' }}
      />
      {cantidadProductos > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            backgroundColor: '#808080',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          {cantidadProductos}
        </div>
      )}
    </div>
  );
} 