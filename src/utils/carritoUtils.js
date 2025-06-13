import axios from 'axios';

// Para pruebas, usamos una URL fija
const API_URL = 'http://localhost:3000';

export const agregarAlCarrito = async (producto) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('Debe iniciar sesión para agregar productos al carrito');
  }

  // Verificar stock actualizado antes de agregar
  const response = await axios.get(`${API_URL}/api/productos`);
  const productoActualizado = response.data.find(p => 
    p.id_repuesto === producto.id_repuesto && 
    p.nombre_pieza === producto.nombre_pieza
  );

  if (!productoActualizado) {
    throw new Error('Producto no encontrado en el catálogo');
  }

  const cantidadDisponible = parseInt(productoActualizado.cantidad_pieza);
  
  if (isNaN(cantidadDisponible)) {
    throw new Error('Error al verificar el stock disponible');
  }

  if (cantidadDisponible <= 0) {
    throw new Error(`El producto ${productoActualizado.nombre_pieza} no está disponible actualmente`);
  }

  const carritoKey = `carrito_${userId}`;
  const carritoGuardado = localStorage.getItem(carritoKey);
  let carrito = [];
  
  if (carritoGuardado) {
    try {
      carrito = JSON.parse(carritoGuardado);
    } catch (error) {
      console.error('Error al parsear el carrito:', error);
      carrito = [];
    }
  }

  // Verificar si el producto ya está en el carrito
  const productoExistente = carrito.find(item => 
    item.id_repuesto === producto.id_repuesto && 
    item.nombre_pieza === producto.nombre_pieza
  );

  if (productoExistente) {
    // Verificar si hay suficiente stock para la cantidad solicitada
    if (productoExistente.cantidad >= cantidadDisponible) {
      throw new Error(`No hay suficiente stock disponible. Stock actual: ${cantidadDisponible}`);
    }
    // Actualizar cantidad y precio
    productoExistente.cantidad += 1;
    productoExistente.precio_pieza = parseFloat(productoActualizado.precio_pieza);
  } else {
    // Agregar nuevo producto
    carrito.push({
      id_repuesto: productoActualizado.id_repuesto,
      nombre_pieza: productoActualizado.nombre_pieza,
      precio_pieza: parseFloat(productoActualizado.precio_pieza),
      cantidad: 1,
      imagen_pieza: productoActualizado.imagen_pieza,
      stock_disponible: cantidadDisponible,
      categoria_id: productoActualizado.id_categoria_pieza
    });
  }

  localStorage.setItem(carritoKey, JSON.stringify(carrito));
  window.dispatchEvent(new Event('carritoActualizado'));
};

export const eliminarProducto = (id_repuesto, nombre_pieza) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  const carritoKey = `carrito_${userId}`;
  const carritoGuardado = localStorage.getItem(carritoKey);
  let carrito = [];
  
  if (carritoGuardado) {
    try {
      carrito = JSON.parse(carritoGuardado);
    } catch (error) {
      console.error('Error al parsear el carrito:', error);
      carrito = [];
    }
  }
  
  const nuevosProductos = carrito.filter(p => 
    !(p.id_repuesto === id_repuesto && p.nombre_pieza === nombre_pieza)
  );
  
  localStorage.setItem(carritoKey, JSON.stringify(nuevosProductos));
  window.dispatchEvent(new Event('carritoActualizado'));
};

export const actualizarCantidad = async (id_repuesto, nombre_pieza, nuevaCantidad) => {
  if (nuevaCantidad < 1) {
    throw new Error('La cantidad debe ser mayor a 0');
  }

  const userId = localStorage.getItem('userId');
  if (!userId) {
    throw new Error('Usuario no autenticado');
  }

  // Verificar stock disponible antes de actualizar
  const response = await axios.get(`${API_URL}/api/productos`);
  const productoDB = response.data.find(p => 
    p.id_repuesto === id_repuesto && 
    p.nombre_pieza === nombre_pieza
  );

  if (!productoDB) {
    throw new Error('Producto no encontrado en el catálogo');
  }

  if (nuevaCantidad > parseInt(productoDB.cantidad_pieza)) {
    throw new Error(`No hay suficiente stock disponible. Stock actual: ${productoDB.cantidad_pieza}`);
  }

  const carritoKey = `carrito_${userId}`;
  const carritoGuardado = localStorage.getItem(carritoKey);
  let carrito = [];
  
  if (carritoGuardado) {
    try {
      carrito = JSON.parse(carritoGuardado);
    } catch (error) {
      console.error('Error al parsear el carrito:', error);
      carrito = [];
    }
  }
  
  const nuevosProductos = carrito.map(p => 
    (p.id_repuesto === id_repuesto && p.nombre_pieza === nombre_pieza)
      ? { ...p, cantidad: nuevaCantidad }
      : p
  );
  
  localStorage.setItem(carritoKey, JSON.stringify(nuevosProductos));
  window.dispatchEvent(new Event('carritoActualizado'));
}; 