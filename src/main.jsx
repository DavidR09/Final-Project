import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import Contactanos from './Contactanos.jsx';
import Neumaticos from './Neumáticos.jsx';  
import Baterias from './Baterías.jsx';
import Faroles from './Faroles.jsx';
import Aros from './Aros.jsx';
import Gatos from './Gatos.jsx';
import Lubricantes from './Lubricantes.jsx';
import Carrocerias from './Carrocerías.jsx';
import Electricos from './Eléctricos.jsx';
import Amortiguadores from './Amortiguadores.jsx';
import Filtros_aceite from './Filtros_aceite.jsx';
import Inicio_Client from './Inicio_Client.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
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
        <Route path="/contactanos" element={<Contactanos />} />
        <Route path="/inicio_client" element={<Inicio_Client />} />

        {/* Rutas de categorías con prefijo /repuestos */}
        <Route path="/repuestos/neumaticos" element={<Neumaticos />} />
        <Route path="/repuestos/baterias" element={<Baterias />} />
        <Route path="/repuestos/faroles" element={<Faroles />} />
        <Route path="/repuestos/aros" element={<Aros />} />
        <Route path="/repuestos/gatos" element={<Gatos />} />
        <Route path="/repuestos/lubricantes" element={<Lubricantes />} />
        <Route path="/repuestos/carrocerias" element={<Carrocerias />} />
        <Route path="/repuestos/electricos" element={<Electricos />} />
        <Route path="/repuestos/amortiguadores" element={<Amortiguadores />} />
        <Route path="/repuestos/filtros_aceite" element={<Filtros_aceite />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
