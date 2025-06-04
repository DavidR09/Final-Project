// src/Router.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import App from './App.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Perfil from './Perfil.jsx';
import InicioClient from './InicioClient.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
// Puedes seguir agregando tus rutas aquí...

const CustomRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/inicio_client" 
        element={
          <ProtectedRoute>
            <InicioClient />
          </ProtectedRoute>
        } 
      />
      {/* Agrega más rutas si decides usar este archivo para routing */}
    </Routes>
  );
};

export default CustomRouter;
