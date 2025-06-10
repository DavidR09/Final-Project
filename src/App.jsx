import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from './config/stripe';

// Componentes que se cargan inmediatamente
import Login from './Login';
import Welcome from './pages/Welcome';
import AccesoDenegado from './pages/AccesoDenegado';

// Lazy loading para componentes menos críticos
const Carrito = lazy(() => import('./Carrito'));
const Inicio = lazy(() => import('./Inicio'));
const InicioClient = lazy(() => import('./Inicio_Client'));
const Productos = lazy(() => import('./Productos'));
const Contacto = lazy(() => import('./Contacto'));
const Pedidos = lazy(() => import('./Pedidos'));
const AdminPedidos = lazy(() => import('./AdminPedidos'));
const Contactanos = lazy(() => import('./Contactanos'));
const Perfil = lazy(() => import('./Perfil'));
const Register = lazy(() => import('./Register'));
const RegisterTaller = lazy(() => import('./RegisterTaller'));
const RegisterRepuesto = lazy(() => import('./RegisterRepuesto'));
const AdminRepuestosPiezas = lazy(() => import('./admin/AdminRepuestosPiezas'));
const AdminUsuarios = lazy(() => import('./admin/AdminUsuarios'));

// Componente de carga
const LoadingComponent = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5'
  }}>
    <div style={{
      padding: '20px',
      borderRadius: '8px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #24487f',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 10px auto'
      }} />
      <p style={{ color: '#24487f', margin: 0 }}>Cargando...</p>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Elements stripe={stripePromise}>
        <Suspense fallback={<LoadingComponent />}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/acceso-denegado" element={<AccesoDenegado />} />
            <Route path="/Contactanos" element={<Contactanos />} />

            {/* Rutas protegidas */}
            <Route path="/inicio" element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Inicio />
              </ProtectedRoute>
            } />

            <Route path="/inicio_client" element={
              <ProtectedRoute allowedRoles={['usuario', 'administrador']}>
                <InicioClient />
              </ProtectedRoute>
            } />

            <Route path="/productos" element={
              <ProtectedRoute allowedRoles={['usuario', 'administrador']}>
                <Productos />
              </ProtectedRoute>
            } />

            <Route path="/contacto" element={
              <ProtectedRoute allowedRoles={['usuario', 'administrador']}>
                <Contacto />
              </ProtectedRoute>
            } />

            <Route path="/pedidos" element={
              <ProtectedRoute allowedRoles={['usuario', 'administrador']}>
                <Pedidos />
              </ProtectedRoute>
            } />

            <Route path="/admin-pedidos" element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <AdminPedidos />
              </ProtectedRoute>
            } />

            <Route path="/perfil" element={
              <ProtectedRoute allowedRoles={['usuario', 'administrador']}>
                <Perfil />
              </ProtectedRoute>
            } />

            <Route path="/carrito" element={
              <ProtectedRoute allowedRoles={['usuario', 'administrador']}>
                <Carrito />
              </ProtectedRoute>
            } />

            <Route path="/register" element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <Register />
              </ProtectedRoute>
            } />

            <Route path="/register-taller" element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <RegisterTaller />
              </ProtectedRoute>
            } />

            <Route path="/register-repuesto" element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <RegisterRepuesto />
              </ProtectedRoute>
            } />

            <Route path="/admin-repuestos-piezas" element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <AdminRepuestosPiezas />
              </ProtectedRoute>
            } />

            <Route path="/admin-usuarios" element={
              <ProtectedRoute allowedRoles={['administrador']}>
                <AdminUsuarios />
              </ProtectedRoute>
            } />

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Elements>
    </BrowserRouter>
  );
}