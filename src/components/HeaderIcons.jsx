import React from 'react';
import { useNavigate } from 'react-router-dom';
import CartIcon from './CartIcon';

export default function HeaderIcons() {
  const navigate = useNavigate();

  return (
    <div className="iconos-header">
      <CartIcon />
      <img
        src="/perfil.png"
        alt="Perfil"
        onClick={() => navigate('/perfil')}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
} 