export const calcularTotal = (carrito) => {
  return carrito.reduce((total, item) => {
    return total + (item.precio_pieza * item.cantidad);
  }, 0);
};

export const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(precio);
};

export const validarStock = (cantidadSolicitada, stockDisponible) => {
  if (cantidadSolicitada <= 0 || stockDisponible <= 0) {
    return false;
  }
  return cantidadSolicitada <= stockDisponible;
}; 