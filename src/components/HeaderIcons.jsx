import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeaderIcons() {
  const navigate = useNavigate();

  return (
    <div className="iconos-header">
      <img
        src="/carrito.png"
        alt="Carrito"
        onClick={() => navigate('/carrito')}
        style={{ cursor: 'pointer' }}
      />
      <img
        src="/perfil.png"
        alt="Perfil"
        onClick={() => navigate('/perfil')}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
} 