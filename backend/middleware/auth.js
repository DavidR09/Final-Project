import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    let token;

    // 1. Intentar obtener el token de las cookies
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    // 2. Intentar obtener el token del header de autorización
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 3. Intentar obtener el token del header cookie
    else if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      token = cookies.token;
    }

    if (!token) {
      console.log('No se encontró token en:', {
        cookies: req.cookies,
        authHeader: req.headers.authorization,
        cookieHeader: req.headers.cookie
      });
      return res.status(401).json({ 
        error: 'No hay token de autenticación',
        message: 'Por favor, inicia sesión nuevamente'
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded);
    
    // Agregar la información del usuario decodificada a la request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ 
      error: 'Token inválido o expirado',
      message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente'
    });
  }
};

// Middleware para verificar roles
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Usuario no autenticado',
        message: 'Por favor, inicia sesión para continuar'
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'No tienes permiso para acceder a este recurso',
        message: 'No tienes los permisos necesarios para realizar esta acción'
      });
    }

    next();
  };
}; 