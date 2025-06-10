// src/Router.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';
import RegisterTaller from './admin/RegisterTaller.jsx';
import RegisterRepuesto from './admin/RegisterRepuesto.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Inicio from './Inicio.jsx';
import Inicio_Client from './Inicio_Client.jsx';
import Productos from './Productos.jsx';
import Carrito from './Carrito.jsx';
import Pedidos from './Pedidos.jsx';
import Contacto from './Contacto.jsx';
import AdminPedidos from './admin/AdminPedidos.jsx';
import AdminRepuestosPiezas from './admin/AdminRepuestosPiezas.jsx';
import AdminUsuarios from './admin/AdminUsuarios.jsx';
// Puedes seguir agregando tus rutas aquí...

const CustomRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/inicio_client" element={<Inicio_Client />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-taller" element={<RegisterTaller />} />
      <Route path="/register-repuesto" element={<RegisterRepuesto />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/pedidos" element={<Pedidos />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/admin-pedidos" element={<AdminPedidos />} />
      <Route path="/admin-repuestos-piezas" element={<AdminRepuestosPiezas />} />
      <Route path="/admin-usuarios" element={<AdminUsuarios />} />
      {/* Agrega más rutas si decides usar este archivo para routing */}
    </Routes>
  );
};

export default CustomRouter;
