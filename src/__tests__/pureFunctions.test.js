import { calcularTotal, formatearPrecio, validarStock } from '../utils/pureFunctions';

describe('Funciones Puras', () => {
  describe('calcularTotal', () => {
    it('calcula correctamente el total de un carrito', () => {
      const carrito = [
        { precio_pieza: 100, cantidad: 2 },
        { precio_pieza: 50, cantidad: 3 }
      ];
      expect(calcularTotal(carrito)).toBe(350);
    });

    it('retorna 0 para carrito vacío', () => {
      expect(calcularTotal([])).toBe(0);
    });

    it('maneja correctamente precios con decimales', () => {
      const carrito = [
        { precio_pieza: 99.99, cantidad: 2 },
        { precio_pieza: 49.99, cantidad: 1 }
      ];
      expect(calcularTotal(carrito)).toBe(249.97);
    });
  });

  describe('formatearPrecio', () => {
    it('formatea correctamente un precio', () => {
      expect(formatearPrecio(1000)).toBe('$1,000.00');
      expect(formatearPrecio(99.99)).toBe('$99.99');
      expect(formatearPrecio(0)).toBe('$0.00');
    });

    it('maneja correctamente números negativos', () => {
      expect(formatearPrecio(-1000)).toBe('-$1,000.00');
    });
  });

  describe('validarStock', () => {
    it('valida correctamente el stock disponible', () => {
      expect(validarStock(5, 10)).toBe(true);
      expect(validarStock(10, 10)).toBe(true);
      expect(validarStock(11, 10)).toBe(false);
    });

    it('maneja correctamente cantidades negativas', () => {
      expect(validarStock(-1, 10)).toBe(false);
      expect(validarStock(5, -1)).toBe(false);
    });
  });
}); 