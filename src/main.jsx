import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Inicio from './Inicio.jsx';  
import Carrito from './Carrito.jsx'; 
import './index.css';
import Perfil from './Perfil.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} /> {/* Ruta para la página de inicio */}
        <Route path="/carrito" element={<Carrito />} /> {/* Ruta para el carrito */}
        <Route path="/perfil" element={<Perfil />} /> {/* Ruta para el perfil */}

      </Routes>
    </Router>
  </React.StrictMode>
);
