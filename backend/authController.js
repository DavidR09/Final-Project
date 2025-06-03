/* global process */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import connectToDatabase from './database/connectionMySQL.js'; // Ajusta la ruta si es necesario

dotenv.config();

// Generador del token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id_usuario, rol: usuario.rol_usuario },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Controlador de login
const login = async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const { correo_electronico_usuario, contrasenia_usuario } = req.body;

    if (!correo_electronico_usuario || !contrasenia_usuario) {
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    const [rows] = await connection.execute(
      `SELECT id_usuario, contrasenia_usuario, rol_usuario 
       FROM usuario WHERE correo_electronico_usuario = ?`,
      [correo_electronico_usuario]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Correo no encontrado' });
    }

    const usuario = rows[0];

    const contraseniaValida = await bcrypt.compare(
      contrasenia_usuario,
      usuario.contrasenia_usuario
    );

    if (!contraseniaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = generarToken(usuario);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      userId: usuario.id_usuario,
      rol: usuario.rol_usuario
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};

export default login;
