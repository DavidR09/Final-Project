const login = async (req, res) => {
  // ... validación de usuario ...
  const token = generarToken(usuario); // Función que crea el JWT

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  });

  res.json({ success: true });
};