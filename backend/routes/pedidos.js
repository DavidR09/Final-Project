import express from 'express';
import connectToDatabase from '../database/connectionMySQL.js';

const router = express.Router();

// Crear un nuevo pedido
router.post('/', async (req, res) => {
  let connection;
  try {
    console.log('Datos recibidos completos:', JSON.stringify(req.body, null, 2));
    
    const { productos, total, id_usuario, direccion_envio_pedido } = req.body;

    console.log('Estructura de productos:', JSON.stringify(productos, null, 2));

    // Validaciones básicas
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ 
        error: 'La lista de productos es inválida',
        productos: productos 
      });
    }

    if (!total || isNaN(total) || total <= 0) {
      return res.status(400).json({ error: 'El total del pedido es inválido' });
    }

    if (!id_usuario || isNaN(id_usuario)) {
      return res.status(400).json({ error: 'El ID de usuario es inválido' });
    }

    if (!direccion_envio_pedido || typeof direccion_envio_pedido !== 'string' || direccion_envio_pedido.trim() === '') {
      return res.status(400).json({ error: 'La dirección de envío es inválida' });
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

      // Convertir valores a números si son strings
      producto.id_repuesto = Number(producto.id_repuesto);
      producto.cantidad = Number(producto.cantidad);
      producto.precio = Number(producto.precio);

      // Verificar que los valores son válidos
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

    // Verificar que todos los productos existen y tienen stock suficiente
    for (const producto of productos) {
      const [stock] = await connection.execute(
        'SELECT cantidad_pieza FROM pieza WHERE id_repuesto = ?',
        [producto.id_repuesto]
      );

      if (stock.length === 0) {
        return res.status(404).json({ 
          error: `El producto con ID ${producto.id_repuesto} no existe` 
        });
      }

      if (stock[0].cantidad_pieza < producto.cantidad) {
        return res.status(400).json({ 
          error: `Stock insuficiente para el producto con ID ${producto.id_repuesto}`,
          stockDisponible: stock[0].cantidad_pieza,
          cantidadSolicitada: producto.cantidad
        });
      }
    }

    await connection.beginTransaction();

    // Insertar el pedido con estado pendiente (id_estado_pedido = 1)
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
    
    // Insertar los detalles del pedido
    for (const producto of productos) {
      const importe_total = producto.cantidad * producto.precio;
      
      await connection.execute(
        'INSERT INTO detalle_pedido (id_pedido, id_pieza, cantidad_detalle, precio_unitario_pieza, importe_total_pedido) VALUES (?, ?, ?, ?, ?)',
        [pedidoId, producto.id_repuesto, producto.cantidad, producto.precio, importe_total]
      );

      // Actualizar el stock
      await connection.execute(
        'UPDATE pieza SET cantidad_pieza = cantidad_pieza - ? WHERE id_repuesto = ?',
        [producto.cantidad, producto.id_repuesto]
      );
    }

    await connection.commit();
    
    res.status(201).json({ 
      message: 'Pedido creado exitosamente', 
      id_pedido: pedidoId 
    });

  } catch (error) {
    console.error('Error completo:', error);
    
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Error en rollback:', rollbackError);
      }
    }

    res.status(500).json({ 
      error: 'Error al crear el pedido',
      message: error.message,
      sqlMessage: error.sqlMessage,
      code: error.code,
      details: error.toString()
    });

  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error al cerrar la conexión:', closeError);
      }
    }
  }
});

// Obtener pedidos del usuario
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await connectToDatabase();
    const usuario_id = req.session.userId;

    console.log('ID de usuario solicitando pedidos:', usuario_id);

    if (!usuario_id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const [pedidos] = await connection.execute(
      `SELECT p.*, e.estado_pedido as nombre_estado,
        t.nombre_taller, t.direccion_taller
       FROM pedido p 
       JOIN estado_pedido e ON p.id_estado_pedido = e.id_estado_pedido
       LEFT JOIN taller t ON t.id_usuario = p.id_usuario
       WHERE p.id_usuario = ? 
       ORDER BY p.fecha_pedido DESC`,
      [usuario_id]
    );

    console.log('Pedidos encontrados:', pedidos.length);

    // Obtener los detalles de cada pedido
    for (let pedido of pedidos) {
      console.log('Obteniendo detalles para pedido:', pedido.id_pedido);
      
      const [detalles] = await connection.execute(
        `SELECT 
          d.id_detalle_pedido,
          d.id_pieza,
          d.cantidad_detalle,
          d.precio_unitario_pieza,
          d.importe_total_pedido,
          r.nombre_pieza,
          r.imagen_pieza,
          r.descripcion_pieza
         FROM detalle_pedido d 
         JOIN pieza r ON d.id_pieza = r.id_repuesto 
         WHERE d.id_pedido = ?`,
        [pedido.id_pedido]
      );

      console.log('Detalles encontrados:', {
        id_pedido: pedido.id_pedido,
        cantidad_detalles: detalles.length,
        detalles: detalles.map(d => ({
          id_detalle: d.id_detalle_pedido,
          pieza: d.nombre_pieza,
          cantidad: d.cantidad_detalle,
          precio: d.precio_unitario_pieza,
          total: d.importe_total_pedido
        }))
      });

      pedido.detalles = detalles;
    }

    console.log('Enviando respuesta con pedidos procesados');
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ 
      error: 'Error al obtener los pedidos',
      message: error.message
    });
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.error('Error al cerrar la conexión:', closeError);
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