import connectToDatabase from '../database/connectionMySQL.js';

// Función para validar y actualizar el stock
export const validateAndUpdateStock = async (connection, producto, cantidad) => {
  try {
    // Obtener el stock actual
    const [stockResult] = await connection.execute(
      'SELECT cantidad_pieza FROM pieza WHERE id_repuesto = ?',
      [producto.id_repuesto]
    );

    if (stockResult.length === 0) {
      throw new Error(`El producto ${producto.nombre_pieza || producto.id_repuesto} no existe`);
    }

    const stockActual = parseInt(stockResult[0].cantidad_pieza);

    // Validar que hay suficiente stock
    if (stockActual < cantidad) {
      throw new Error(`Stock insuficiente para ${producto.nombre_pieza || producto.id_repuesto}. Stock disponible: ${stockActual}`);
    }

    // Validar que el stock no quedará negativo
    if (stockActual - cantidad < 0) {
      throw new Error(`No se puede reducir el stock por debajo de 0`);
    }

    return stockActual;
  } catch (error) {
    throw error;
  }
};

// Función para actualizar el stock
export const updateStock = async (connection, productoId, cantidad) => {
  try {
    // Primero verificamos el stock actual
    const [stockResult] = await connection.execute(
      'SELECT cantidad_pieza FROM pieza WHERE id_repuesto = ?',
      [productoId]
    );

    if (stockResult.length === 0) {
      throw new Error('Producto no encontrado');
    }

    const stockActual = parseInt(stockResult[0].cantidad_pieza);
    const nuevoStock = stockActual - cantidad;

    if (nuevoStock < 0) {
      throw new Error(`No hay suficiente stock disponible. Stock actual: ${stockActual}`);
    }

    // Si hay suficiente stock, actualizamos
    await connection.execute(
      'UPDATE pieza SET cantidad_pieza = ? WHERE id_repuesto = ?',
      [nuevoStock, productoId]
    );
  } catch (error) {
    throw error;
  }
};

// Función para verificar stock bajo y enviar alertas
export const checkLowStock = async (connection, umbralBajo = 5) => {
  try {
    const [productos] = await connection.execute(
      'SELECT id_repuesto, nombre_pieza, cantidad_pieza FROM pieza WHERE cantidad_pieza <= ?',
      [umbralBajo]
    );

    return productos;
  } catch (error) {
    throw error;
  }
};

// Función para corregir stock negativo
export const fixNegativeStock = async () => {
  let connection;
  try {
    connection = await connectToDatabase();
    await connection.execute(
      'UPDATE pieza SET cantidad_pieza = 0 WHERE cantidad_pieza < 0'
    );
    
    // Agregar restricción CHECK si no existe
    await connection.execute(`
      ALTER TABLE pieza ADD CONSTRAINT IF NOT EXISTS check_cantidad_no_negativa 
      CHECK (cantidad_pieza >= 0)
    `);

  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}; 