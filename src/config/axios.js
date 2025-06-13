import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend-respuestosgra.up.railway.app',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000,
  // Deshabilitar las credenciales por defecto de axios
  xsrfCookieName: null,
  xsrfHeaderName: null
});

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  response => {
    console.log('Respuesta exitosa:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    console.error('Error en la petición:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      message: error.message
    });

    if (error.code === 'ECONNABORTED') {
      console.error('La petición tardó demasiado en responder. El servidor puede estar inactivo.');
    }

    if (error.response?.status === 401) {
      // Limpiar sessionStorage en caso de error de autenticación
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userId');
    }
    return Promise.reject(error);
  }
);

// Interceptor para peticiones
axiosInstance.interceptors.request.use(
  config => {
    // Asegurarse de que withCredentials esté siempre activado
    config.withCredentials = true;
    // Agregar el token JWT al header Authorization si existe
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Enviando petición:', {
      url: config.url,
      method: config.method,
      withCredentials: config.withCredentials,
      headers: config.headers
    });
    return config;
  },
  error => {
    console.error('Error al preparar la petición:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance; 