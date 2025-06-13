import { agregarAlCarrito, actualizarCantidad } from '../utils/carritoUtils';
import axios from 'axios';

// Mock de axios
jest.mock('axios');

// Mock de localStorage
const mockLocalStorage = {
  store: {},
  getItem: jest.fn(key => mockLocalStorage.store[key]),
  setItem: jest.fn((key, value) => {
    mockLocalStorage.store[key] = value;
  }),
  clear: jest.fn(() => {
    mockLocalStorage.store = {};
  })
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Pruebas de Integración', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  test('INTEGRACION_FLUJO_COMPRA_COMPLETO', async () => {
    // 1. Configurar datos iniciales
    const mockProducto = {
      id_repuesto: 1,
      nombre_pieza: 'Batería 12V',
      cantidad_pieza: '10',
      precio_pieza: '5500.00',
      imagen_pieza: 'bateria.jpg'
    };

    // 2. Simular inicio de sesión
    mockLocalStorage.setItem('userId', '123');

    // 3. Simular respuesta de la API para verificar stock
    axios.get.mockResolvedValueOnce({ data: [mockProducto] });

    // 4. Agregar producto al carrito
    await agregarAlCarrito(mockProducto);

    // 5. Verificar que el producto se agregó correctamente
    const carritoGuardado = JSON.parse(mockLocalStorage.store['carrito_123']);
    expect(carritoGuardado).toHaveLength(1);
    expect(carritoGuardado[0]).toMatchObject({
      id_repuesto: 1,
      nombre_pieza: 'Batería 12V',
      cantidad: 1,
      precio_pieza: 5500.00
    });

    // 6. Simular actualización de cantidad
    axios.get.mockResolvedValueOnce({ data: [mockProducto] });
    await actualizarCantidad(1, 'Batería 12V', 2);

    // 7. Verificar que la cantidad se actualizó
    const carritoActualizado = JSON.parse(mockLocalStorage.store['carrito_123']);
    expect(carritoActualizado[0].cantidad).toBe(2);

    // 8. Verificar el total del carrito
    const total = carritoActualizado.reduce((sum, item) => 
      sum + (item.precio_pieza * item.cantidad), 0);
    expect(total).toBe(11000.00);

    // 9. Verificar que el stock se actualizó correctamente
    expect(carritoActualizado[0].stock_disponible).toBe(10);
  });

  test('INTEGRACION_ERROR_STOCK_INSUFICIENTE', async () => {
    // 1. Configurar datos iniciales
    const mockProducto = {
      id_repuesto: 1,
      nombre_pieza: 'Batería 12V',
      cantidad_pieza: '1', // Stock limitado
      precio_pieza: '5500.00',
      imagen_pieza: 'bateria.jpg'
    };

    // 2. Simular inicio de sesión
    mockLocalStorage.setItem('userId', '123');

    // 3. Simular respuesta de la API
    axios.get.mockResolvedValueOnce({ data: [mockProducto] });

    // 4. Agregar producto al carrito
    await agregarAlCarrito(mockProducto);

    // 5. Intentar actualizar a una cantidad mayor al stock
    axios.get.mockResolvedValueOnce({ data: [mockProducto] });
    
    // 6. Verificar que se lanza el error correcto
    await expect(actualizarCantidad(1, 'Batería 12V', 2))
      .rejects
      .toThrow('No hay suficiente stock disponible');
  });
}); 