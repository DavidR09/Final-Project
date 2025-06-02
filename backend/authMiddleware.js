/* global process */
import jwt from 'jsonwebtoken';

export const authenticate = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Verificar si el rol está autorizado
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(decoded.rol)) {
        return res.status(403).json({ error: 'No tienes permisos para esta acción' });
      }

      next();
} catch (error) {
  console.error(error); // <-- Usar la variable
  res.status(401).json({ error: 'Token inválido' });
}
  };
};