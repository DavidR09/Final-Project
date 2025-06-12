import express from 'express';
import connectToDatabase from '../database/connectionMySQL.js';
import { validateAndUpdateStock, updateStock, checkLowStock } from '../utils/stockValidation.js';
import { verifyToken, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyToken);

// Crear un nuevo pedido
router.post('/', async (req, res) => {
  let connection;
  try {
    const { productos, total, id_usuario, direccion_envio_pedido } = req.body;

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ error: 'Debe proporcionar productos válidos' });
    }

    if (!id_usuario) {
      return res.status(400).json({ error: 'Debe proporcionar un ID de usuario' });
    }

    // Validar estructura de productos
    for (const producto of productos) {
      console.log('Validando producto:', producto);
      
      // Verificar que todos los campos necesarios existen
      const camposRequeridos = ['id_repuesto', 'cantidad', 'precio'];
      const camposFaltantes = camposRequeridos.filter(campo => {
        const valor = producto[campo];
        return valor === undefined || valor === null || 
               (typeof valor === 'string' && valor.trim() === '') ||
               (typeof valor === 'number' && isNaN(valor));
      });

      if (camposFaltantes.length > 0) {
        return res.status(400).json({ 
          error: 'Estructura de producto inválida',
          producto: producto,
          camposFaltantes: camposFaltantes
        });
      }

      // Convertir valores a números
      producto.id_repuesto = Number(producto.id_repuesto);
      producto.cantidad = Number(producto.cantidad);
      producto.precio = Number(producto.precio);

      // Validar valores
      if (isNaN(producto.id_repuesto) || producto.id_repuesto <= 0) {
        return res.status(400).json({ 
          error: 'ID de repuesto inválido',
          producto: producto
        });
      }

      if (isNaN(producto.cantidad) || producto.cantidad <= 0) {
        return res.status(400).json({ 
          error: 'Cantidad inválida',
          producto: producto
        });
      }

      if (isNaN(producto.precio) || producto.precio <= 0) {
        return res.status(400).json({ 
          error: 'Precio inválido',
          producto: producto
        });
      }
    }

    connection = await connectToDatabase();

    // Verificar que el usuario existe
    const [usuarios] = await connection.execute(
      'SELECT id_usuario FROM usuario WHERE id_usuario = ?',
      [id_usuario]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar stock de todos los productos antes de comenzar la transacción
    for (const producto of productos) {
      try {
        await validateAndUpdateStock(connection, producto, producto.cantidad);
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    }

    await connection.beginTransaction();

    try {
      // Insertar el pedido
      const [pedidoResult] = await connection.execute(
        'INSERT INTO pedido (id_usuario, total_pedido, id_estado_pedido, direccion_envio_pedido) VALUES (?, ?, 1, ?)',
        [id_usuario, total, direccion_envio_pedido]
      );

      const pedidoId = pedidoResult.insertId;

      // Insertar el pago
      await connection.execute(
        'INSERT INTO pago (estado_pago, metodo_pago, monto_pago, id_pedido) VALUES (?, ?, ?, ?)',
        [1, req.body.metodo_pago, total, pedidoId]
      );
      
      // Insertar detalles y actualizar stock
      for (const producto of productos) {
        const importe_total = producto.cantidad * producto.precio * 1.18;
        
        await connection.execute(
          'INSERT INTO detalle_pedido (id_pedido, id_pieza, cantidad_detalle, precio_unitario_pieza, importe_total_pedido) VALUES (?, ?, ?, ?, ?)',
          [pedidoId, producto.id_repuesto, producto.cantidad, producto.precio, importe_total]
        );

        // Actualizar stock
        await updateStock(connection, producto.id_repuesto, producto.cantidad);
      }

      // Verificar productos con stock bajo
      const productosStockBajo = await checkLowStock(connection);
      if (productosStockBajo.length > 0) {
        console.log('Productos con stock bajo:', productosStockBajo);
      }

      await connection.commit();
      
      res.status(201).json({ 
        message: 'Pedido creado exitosamente',
        id_pedido: pedidoId
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error al crear pedido:', error);
    
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Error en rollback:', rollbackError);
      }
    }

    // Determinar el tipo de error y enviar una respuesta apropiada
    if (error.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
      res.status(400).json({ 
        error: 'No hay suficiente stock disponible para completar el pedido'
      });
    } else {
      res.status(500).json({ 
        error: error.message || 'Error al crear el pedido'
      });
    }
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

// Obtener pedidos del usuario actual (accesible para usuarios y administradores)
router.get('/', checkRole(['usuario', 'administrador']), async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    console.log('Usuario solicitando pedidos:', req.user);

    // Si es administrador y está en modo vista cliente, obtener sus propios pedidos
    // Si es usuario normal, obtener sus pedidos
    const [pedidos] = await connection.execute(`
      SELECT 
        p.id_pedido,
        p.fecha_pedido,
        p.total_pedido,
        p.direccion_envio_pedido,
        u.id_usuario,
        u.nombre_usuario,
        u.apellido_usuario,
        t.nombre_taller,
        t.direccion_taller,
        ep.estado_pedido as nombre_estado
      FROM pedido p
      INNER JOIN usuario u ON p.id_usuario = u.id_usuario
      LEFT JOIN taller t ON u.id_usuario = t.id_usuario
      INNER JOIN estado_pedido ep ON p.id_estado_pedido = ep.id_estado_pedido
      WHERE p.id_usuario = ?
      ORDER BY p.fecha_pedido DESC
    `, [req.user.id]);

    // Obtener los detalles de cada pedido
    for (const pedido of pedidos) {
      const [detalles] = await connection.execute(`
        SELECT 
          dp.id_detalle_pedido,
          dp.id_pieza,
          dp.cantidad_detalle,
          dp.precio_unitario_pieza,
          dp.importe_total_pedido,
          p.nombre_pieza,
          p.imagen_pieza
        FROM detalle_pedido dp
        INNER JOIN pieza p ON dp.id_pieza = p.id_repuesto
        WHERE dp.id_pedido = ?
      `, [pedido.id_pedido]);

      pedido.detalles = detalles;
    }

    res.json(pedidos);

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los pedidos',
      details: error.message
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

// Obtener todos los pedidos (solo admin)
router.get('/admin', checkRole(['administrador']), async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();

    // Obtener todos los pedidos con información del usuario y su taller si tiene
    const [pedidos] = await connection.execute(`
      SELECT 
        p.id_pedido,
        p.fecha_pedido,
        p.total_pedido,
        p.direccion_envio_pedido,
        u.id_usuario,
        u.nombre_usuario,
        u.apellido_usuario,
        t.nombre_taller,
        t.direccion_taller,
        ep.estado_pedido as nombre_estado
      FROM pedido p
      INNER JOIN usuario u ON p.id_usuario = u.id_usuario
      LEFT JOIN taller t ON u.id_usuario = t.id_usuario
      INNER JOIN estado_pedido ep ON p.id_estado_pedido = ep.id_estado_pedido
      ORDER BY p.fecha_pedido DESC
    `);

    // Obtener los detalles de cada pedido
    for (const pedido of pedidos) {
      const [detalles] = await connection.execute(`
        SELECT 
          dp.id_detalle_pedido,
          dp.id_pieza,
          dp.cantidad_detalle,
          dp.precio_unitario_pieza,
          dp.importe_total_pedido,
          p.nombre_pieza,
          p.imagen_pieza
        FROM detalle_pedido dp
        INNER JOIN pieza p ON dp.id_pieza = p.id_repuesto
        WHERE dp.id_pedido = ?
      `, [pedido.id_pedido]);

      pedido.detalles = detalles;
    }

    res.json(pedidos);

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los pedidos',
      details: error.message
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});

// Cancelar un pedido
router.put('/:id/cancelar', async (req, res) => {
  let connection;
  try {
    const pedidoId = req.params.id;
    const usuarioId = req.session.userId;

    if (!usuarioId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    connection = await connectToDatabase();

    // Verificar que el pedido existe y pertenece al usuario
    const [pedido] = await connection.execute(
      'SELECT fecha_pedido, id_estado_pedido FROM pedido WHERE id_pedido = ? AND id_usuario = ?',
      [pedidoId, usuarioId]
    );

    if (pedido.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Verificar que el pedido está dentro del límite de 5 minutos
    const tiempoLimite = 5 * 60 * 1000; // 5 minutos en milisegundos
    const fechaCreacion = new Date(pedido[0].fecha_pedido).getTime();
    const ahora = new Date().getTime();

    if ((ahora - fechaCreacion) > tiempoLimite) {
      return res.status(400).json({ 
        error: 'No se puede cancelar el pedido después de 5 minutos de su creación' 
      });
    }

    // Verificar que el pedido está en estado pendiente
    if (pedido[0].id_estado_pedido !== 1) { // Asumiendo que 1 es el ID del estado "pendiente"
      return res.status(400).json({ 
        error: 'Solo se pueden cancelar pedidos en estado pendiente' 
      });
    }

    // Actualizar el estado del pedido a cancelado
    await connection.execute(
      'UPDATE pedido SET id_estado_pedido = 5 WHERE id_pedido = ?', // 5 es el ID del estado "cancelado"
      [pedidoId]
    );

    res.json({ mensaje: 'Pedido cancelado exitosamente' });
  } catch (error) {
    console.error('Error al cancelar el pedido:', error);
    res.status(500).json({ error: 'Error al cancelar el pedido' });
  } finally {
    if (connection) {
      connection.end();
    }
  }
});

export default router;