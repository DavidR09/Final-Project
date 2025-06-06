/* global process */
import jwt from 'jsonwebtoken';

export const authenticate = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado - No hay token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      console.log('Usuario autenticado:', {
        userId: decoded.id,
        rol: decoded.rol,
        rolesPermitidos: rolesPermitidos
      });

      //console.log('Login exitoso para:', correo, 'con rol:', user.rol_usuario);

      // Si no hay roles específicos requeridos, permitir acceso
      if (rolesPermitidos.length === 0) {
        return next();
      }

      // Si el usuario es administrador, siempre permitir acceso
      if (decoded.rol === 'administrador') {
        return next();
      }

      // Para otros roles, verificar si están permitidos
      if (!rolesPermitidos.includes(decoded.rol)) {
        console.log('Acceso denegado - Rol no autorizado:', {
          userRole: decoded.rol,
          rolesPermitidos: rolesPermitidos
        });
        return res.status(403).json({ 
          error: 'No tienes permisos para esta acción',
          rol: decoded.rol,
          rolesPermitidos: rolesPermitidos
        });
      }

      next();
    } catch (error) {
      console.error('Error de autenticación:', error);
      res.status(401).json({ 
        error: 'Token inválido o expirado',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };
};