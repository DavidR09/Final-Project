import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './Login';
import Carrito from './Carrito';
import Welcome from './pages/Welcome';
import AccesoDenegado from './pages/AccesoDenegado';

// Importa aquí el resto de tus componentes
// import Inicio from './pages/Inicio';
// import Productos from './pages/Productos';
// etc...

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/acceso-denegado" element={<AccesoDenegado />} />
      
      {/* Rutas protegidas para usuarios normales */}
      <Route
        path="/Inicio_Client"
        element={
          <ProtectedRoute allowedRoles={['usuario']}>
            {/* <Inicio /> */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/productos_client"
        element={
          <ProtectedRoute allowedRoles={['usuario']}>
            {/* <Productos /> */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/Carrito"
        element={
          <ProtectedRoute allowedRoles={['usuario']}>
            <Carrito />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas para administradores */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            {/* <AdminDashboard /> */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/productos"
        element={
          <ProtectedRoute allowedRoles={['administrador']}>
            {/* <AdminProductos /> */}
          </ProtectedRoute>
        }
      />

      {/* Ruta para manejar rutas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
