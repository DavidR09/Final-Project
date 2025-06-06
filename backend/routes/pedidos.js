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
        'INSERT INTO detalle_pedido (id_pedido, id_pieza, cantidad, precio_unitario_pieza, importe_total_pedido) VALUES (?, ?, ?, ?, ?)',
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
        COALESCE(t.direccion_taller, p.direccion_envio_pedido) as direccion_envio_pedido
       FROM pedido p 
       JOIN estado_pedido e ON p.id_estado_pedido = e.id_estado_pedido
       LEFT JOIN taller t ON p.id_taller = t.id_taller
       WHERE p.id_usuario = ? 
       ORDER BY p.fecha_pedido DESC`,
      [usuario_id]
    );

    console.log('Pedidos encontrados:', pedidos.length);

    // Obtener los detalles de cada pedido
    for (let pedido of pedidos) {
      console.log('Obteniendo detalles para pedido:', pedido.id_pedido);
      
      const [detalles] = await connection.execute(
        `SELECT d.id_detalle_pedido, d.id_pieza, d.precio_unitario_pieza, d.importe_total_pedido, 
         r.nombre_pieza, r.imagen_pieza, r.cantidad_pieza as stock_actual,
         d.cantidad
         FROM detalle_pedido d 
         JOIN pieza r ON d.id_pieza = r.id_repuesto 
         WHERE d.id_pedido = ?`,
        [pedido.id_pedido]
      );

      console.log('Detalles encontrados:', detalles.length);

      // Ya no necesitamos calcular la cantidad, la obtenemos directamente de la base de datos
      for (let detalle of detalles) {
        console.log('Detalle procesado:', {
          id_detalle: detalle.id_detalle_pedido,
          id_pieza: detalle.id_pieza,
          nombre: detalle.nombre_pieza,
          cantidad: detalle.cantidad,
          precio: detalle.precio_unitario_pieza,
          total: detalle.importe_total_pedido
        });
      }

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

export default router; 