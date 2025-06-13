import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

// Configuración de Axios
const axiosInstance = axios.create({
  baseURL: 'https://backend-respuestosgra.up.railway.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Función para obtener cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Interceptor para el token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function RegisterTaller() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre_taller: '',
    direccion_taller: '',
    id_usuario: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getCookie('token');
        if (!token) throw new Error('No hay token de autenticación');

        const response = await axiosInstance.get('/api/auth/check-auth');
        if (response.data.rol !== 'administrador') {
          throw new Error('Acceso restringido a administradores');
        }
        setAuthChecked(true);
      } catch (error) {
        console.error('Error de autenticación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Acceso no autorizado',
          text: 'Debes iniciar sesión como administrador',
          confirmButtonColor: '#24487f'
        }).then(() => navigate('/login'));
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.post('/api/talleres/registrar', {
        ...formData,
        id_usuario: parseInt(formData.id_usuario)
      });

      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Taller registrado correctamente',
        confirmButtonColor: '#24487f'
      });

      setFormData({
        nombre_taller: '',
        direccion_taller: '',
        id_usuario: ''
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Error al registrar el taller',
        confirmButtonColor: '#24487f'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Verificando credenciales...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logoWrapper} onClick={() => navigate('/inicio')}>
          <img src="/Logo.png" alt="Logo" style={styles.logo} />
        </div>
        <ul style={styles.menuList}>
          <li style={styles.menuItem} onClick={() => navigate('/Inicio')}>Panel de Administración</li>
          <li style={styles.menuItem} onClick={() => navigate('/register')}>Registrar Usuario</li>
          <li style={styles.menuItem} onClick={() => navigate('/register-taller')}>Registrar Taller</li>
          <li style={styles.menuItem} onClick={() => navigate('/register-repuesto')}>Registrar Repuesto</li>
          <li style={styles.menuItem} onClick={() => navigate('/admin-pedidos')}>Ver Pedidos Clientes</li>
          <li style={styles.menuItem} onClick={() => navigate('/admin-repuestos-piezas')}>Gestionar Repuestos</li>
          <li style={styles.menuItem} onClick={() => navigate('/admin-usuarios')}>Gestionar Usuarios</li>
          <li style={styles.menuItem} onClick={() => navigate('/Inicio_Client')}>Vista Cliente</li>
          <li style={styles.menuItem} onClick={() => navigate('/')}>Cerrar sesión</li>
        </ul>
      </aside>

      <main style={styles.mainContent}>
        <section style={styles.contentSection}>
          <div style={styles.header}>
            <h1 style={styles.title}>Registro de Taller</h1>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Nombre del Taller:</label>
            <input
              type="text"
              name="nombre_taller"
              value={formData.nombre_taller}
              onChange={handleChange}
              required
              maxLength="30"
              disabled={isLoading}
              style={styles.input}
            />

            <label style={styles.label}>Dirección:</label>
            <input
              type="text"
              name="direccion_taller"
              value={formData.direccion_taller}
              onChange={handleChange}
              required
              maxLength="70"
              disabled={isLoading}
              style={styles.input}
            />

            <label style={styles.label}>ID de Usuario:</label>
            <input
              type="number"
              name="id_usuario"
              value={formData.id_usuario}
              onChange={handleChange}
              required
              disabled={isLoading}
              style={styles.input}
            />

            <button
              type="submit"
              disabled={isLoading}
              style={isLoading ? styles.buttonDisabled : styles.button}
            >
              {isLoading ? 'Registrando...' : 'Registrar Taller'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

// Estilos en objeto JavaScript
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#ffffff'
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#24487f',
    color: 'white',
    padding: '20px'
  },
  logoWrapper: {
    width: '120px',
    height: '120px',
    backgroundColor: 'white',
    borderRadius: '50%',
    overflow: 'hidden',
    margin: '0 auto 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  logo: {
    width: '90%',
    height: '90%',
    objectFit: 'contain'
  },
  menuList: {
    listStyle: 'none',
    padding: 0
  },
  menuItem: {
    marginBottom: '15px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#333'
    },
    ':active': {
      backgroundColor: '#1b355b'
    }
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  contentSection: {
    padding: '20px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    overflowY: 'auto',
    backgroundColor: '#ffffff',
    color: 'black'
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center'
  },
  title: {
    fontSize: '24px',
    color: '#24487f'
  },
  form: {
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  label: {
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '16px',
    width: '100%',
    boxSizing: 'border-box',
    ':disabled': {
      backgroundColor: '#f5f5f5',
      cursor: 'not-allowed'
    }
  },
  button: {
    backgroundColor: '#24487f',
    color: 'white',
    border: 'none',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#1a365d'
    }
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
    color: 'white',
    border: 'none',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'not-allowed',
    marginTop: '20px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh'
  },
  spinner: {
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #24487f',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingText: {
    fontSize: '18px',
    color: '#24487f'
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
};