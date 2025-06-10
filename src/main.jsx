import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Desactivar StrictMode en producción para evitar renderizados dobles
const root = ReactDOM.createRoot(document.getElementById('root'));
const app = import.meta.env.DEV ? (
  <React.StrictMode>
    <App />
  </React.StrictMode>
) : (
  <App />
);

root.render(app);
