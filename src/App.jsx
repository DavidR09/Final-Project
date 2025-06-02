import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Contactanos from './Contactanos';
//import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/api/verify-auth', { 
          withCredentials: true 
        });
        setIsAuthenticated(true);
        setUserRole(data.user?.rol);
        
        // Redirigir a dashboard si ya está autenticado
        if (window.location.pathname === '/') {
          navigate(data.user?.rol === 'admin' ? '/admin' : '/');
        }
      } catch (error) {
  console.error('Error al verificar autenticación:', error);
  setIsAuthenticated(false);
}
    };

    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div className="loading-screen">Cargando...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/contactanos" element={<Contactanos />} />
        
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute isAllowed={isAuthenticated} />}>
          <Route path="/inicio_clien" element={<Dashboard />} />
          <Route path="/admin" element={
            <ProtectedRoute isAllowed={userRole === 'admin'} redirectPath="/inicio_clien">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Ruta principal */}
        <Route path="/" element={
          isAuthenticated ? (
            <Navigate to={userRole === 'admin' ? '/admin' : '/'} replace />
          ) : (
            <WelcomePage />
          )
        } />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

// Componente de página de bienvenida (tu código original)
function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="left-section">
        <img src="/public/fotinicio.jpg" alt="Dashboard ilustración" />
      </div>
      <div className="right-section">
        <div className="logo-container">
          <img src="/public/Logo.png" alt="Logo de Repuestos G.R.A" />
        </div>
        <h1>Bienvenido a <span className="highlight">Repuestos G.R.A</span></h1>
        <p className="intro-text">
          Somos una plataforma de comercio electrónico especializada en la venta de piezas automotrices 
          para vehículos de cualquier marca, modelo o año.
        </p>
        <div className="button-group">
          <button onClick={() => navigate('/login')} className="primary-btn">
            Iniciar Sesión
          </button>
          <button onClick={() => navigate('/contactanos')} className="secondary-btn">
            Contáctanos
          </button>
        </div>
      </div>

      <style jsx>{`
        .welcome-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .left-section {
          flex: 1;
          background-color: #2a2829;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .left-section img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .right-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background-color: white;
          color: #111;
          padding: 40px;
        }

        .logo-container {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .logo-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .right-section h1 {
          font-size: 36px;
          margin-bottom: 20px;
        }

        .highlight {
          color: #24487f;
        }

        .intro-text {
          font-size: 18px;
          color: #333;
          margin-bottom: 15px;
          max-width: 600px;
        }

        .button-group {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .primary-btn,
        .secondary-btn {
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-btn {
          background-color: #24487f;
          color: white;
        }

        .primary-btn:hover {
          background-color: #b9d7d9;
          color: black;
        }

        .secondary-btn {
          background-color: #e0e7ff;
          color: #1e3a8a;
        }

        .secondary-btn:hover {
          background-color: #c7d2fe;
        }
      `}</style>
    </div>
  );
}

/* import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function App() {
  const navigate = useNavigate();


  return (
    <div className="welcome-container">
      <div className="left-section">
        <img src="/public/fotinicio.jpg" alt="Dashboard ilustración" />
      </div>
      <div className="right-section">
        <div className="logo-container">
          <img src="/public/Logo.png" alt="Logo de Repuestos G.R.A" />
        </div>
        <h1>Bienvenido a <span className="highlight">Repuestos G.R.A</span></h1>
        <p className="intro-text">
          Somos una plataforma de comercio electrónico especializada en la venta de piezas automotrices 
          para vehículos de cualquier marca, modelo o año. Nuestro principal objetivo es resolver la mayor 
          necesidad del mercado: <strong>la demora en la obtención de piezas esenciales</strong>.
        </p>
        <div className="button-group">
          <button onClick={() => navigate('/login')} className="primary-btn">
            Iniciar Sesión
          </button>
          <button onClick={() => navigate('/contactanos')} className="secondary-btn">
            Contáctanos
          </button>
        </div>
      </div>

      <style jsx>{`
        .welcome-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', sans-serif;
        }

        .left-section {
          flex: 1;
          background-color: #2a2829;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .left-section img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .right-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background-color: white;
          color: #111;
          padding: 40px;
        }

        .logo-container {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .logo-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .right-section h1 {
          font-size: 36px;
          margin-bottom: 20px;
        }

        .highlight {
          color: #24487f;
        }

        .intro-text {
          font-size: 18px;
          color: #333;
          margin-bottom: 15px;
          max-width: 600px;
        }

        .button-group {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .primary-btn,
        .secondary-btn {
          padding: 12px 24px;
          font-size: 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .primary-btn {
          background-color: #24487f;
          color: white;
        }

        .primary-btn:hover {
          background-color: #b9d7d9;
          color: black;
        }

        .secondary-btn {
          background-color: #e0e7ff;
          color: #1e3a8a;
        }

        .secondary-btn:hover {
          background-color: #c7d2fe;
        }
      `}</style>
    </div>
  );
} */
