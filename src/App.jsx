import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from './config/stripe';
import Login from './Login';
import Carrito from './Carrito';
import Welcome from './pages/Welcome';
import AccesoDenegado from './pages/AccesoDenegado';
import Inicio from './Inicio';
import InicioClient from './Inicio_Client';
import Productos from './Productos';
import Contacto from './Contacto';
import Pedidos from './Pedidos';
import Contactanos from './Contactanos';
import Perfil from './Perfil';
import Register from './Register';

export default function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/acceso-denegado" element={<AccesoDenegado />} />
          <Route path="/Contactanos" element={<Contactanos />} />

          {/* Rutas protegidas para usuarios normales */}
          <Route
            path="/Inicio_Client"
            element={
              <ProtectedRoute allowedRoles={['usuario', 'administrador']}>
                <InicioClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/productos"
            element={
              <ProtectedRoute allowedRoles={['usuario']}>
                <Productos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/carrito"
            element={
              <ProtectedRoute allowedRoles={['usuario']}>
                <Carrito />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <ProtectedRoute allowedRoles={['usuario']}>
                <Pedidos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacto"
            element={
              <ProtectedRoute allowedRoles={['usuario']}>
                <Contacto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute allowedRoles={['usuario']}>
                <Perfil />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para administradores */}
          <Route
            path="/Inicio"
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Inicio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Register />
              </ProtectedRoute>
            }
          />

          {/* Ruta para manejar rutas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Elements>
    </BrowserRouter>
  );
}