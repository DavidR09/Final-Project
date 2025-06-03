import connectToDatabase from './connectionMySQL.js';
import bcrypt from 'bcrypt';

async function actualizarContrasenas() {
  try {
    const connection = await connectToDatabase();

    // Traer usuarios con sus contraseñas actuales
    const [usuarios] = await connection.execute(
      `SELECT id_usuario, contrasenia_usuario FROM usuario`
    );

    for (const usuario of usuarios) {
      const { id_usuario, contrasenia_usuario } = usuario;

      // Verificar si la contraseña ya parece un hash bcrypt (empieza con $2)
      if (typeof contrasenia_usuario === 'string' && contrasenia_usuario.startsWith('$2')) {
        console.log(`Usuario ${id_usuario} ya tiene contraseña hasheada.`);
        continue; // Ya está hasheada, saltar
      }

      // Si la contraseña no está hasheada, hacer hash y actualizar
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(contrasenia_usuario.toString(), saltRounds);

      await connection.execute(
        `UPDATE usuario SET contrasenia_usuario = ? WHERE id_usuario = ?`,
        [hashedPassword, id_usuario]
      );

      console.log(`Contraseña del usuario ${id_usuario} actualizada correctamente.`);
    }

    console.log('Proceso terminado.');

  } catch (error) {
    console.error('Error actualizando contraseñas:', error);
  }
}

actualizarContrasenas();