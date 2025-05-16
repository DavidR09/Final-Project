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
import Productos from './Productos.jsx';
import Contacto from './Contacto.jsx';
import Pedidos from './Pedidos.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} /> 
        <Route path="/carrito" element={<Carrito />} /> 
        <Route path="/perfil" element={<Perfil />} /> 
        <Route path="/productos" element={<Productos />} /> 
        <Route path="/contacto" element={<Contacto />} /> 
        <Route path="/pedidos" element={<Pedidos />} />




      </Routes>
    </Router>
  </React.StrictMode>
);
