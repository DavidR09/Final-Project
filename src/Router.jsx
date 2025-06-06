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
// Puedes seguir agregando tus rutas aquí...

const CustomRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/inicio" element={<Inicio />} />
      <Route path="/inicio_client" element={<Inicio_Client />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/register-taller" element={<RegisterTaller />} />
      <Route path="/admin/register-repuesto" element={<RegisterRepuesto />} />
      {/* Agrega más rutas si decides usar este archivo para routing */}
    </Routes>
  );
};

export default CustomRouter;
