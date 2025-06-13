import { agregarAlCarrito, eliminarProducto, actualizarCantidad } from '../utils/carritoUtils';
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

describe('Funciones del Carrito', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
  });

  test('TEST_UNITARIO_AGREGAR_PRODUCTO', async () => {
    const mockProducto = {
      id_repuesto: 1,
      nombre_pieza: 'Batería 12V',
      cantidad_pieza: '10',
      precio_pieza: '5500.00',
      imagen_pieza: 'bateria.jpg'
    };

    axios.get.mockResolvedValueOnce({ data: [mockProducto] });
    mockLocalStorage.setItem('userId', '123');

    await agregarAlCarrito(mockProducto);

    const carritoGuardado = JSON.parse(mockLocalStorage.store['carrito_123']);
    expect(carritoGuardado).toHaveLength(1);
    expect(carritoGuardado[0]).toMatchObject({
      id_repuesto: 1,
      nombre_pieza: 'Batería 12V',
      cantidad: 1,
      precio_pieza: 5500.00
    });
  });

  it('actualiza la cantidad si el producto ya existe', async () => {
    const mockProducto = {
      id_repuesto: 1,
      nombre_pieza: 'Test Product',
      cantidad_pieza: '10',
      precio_pieza: '100'
    };

    axios.get.mockResolvedValueOnce({ data: [mockProducto] });
    mockLocalStorage.setItem('userId', '123');
    mockLocalStorage.setItem('carrito_123', JSON.stringify([{
      ...mockProducto,
      cantidad: 1
    }]));

    await agregarAlCarrito(mockProducto);

    const carrito = JSON.parse(mockLocalStorage.store['carrito_123']);
    expect(carrito[0].cantidad).toBe(2);
  });

  it('elimina un producto del carrito', () => {
    mockLocalStorage.setItem('userId', '123');
    mockLocalStorage.setItem('carrito_123', JSON.stringify([
      { id_repuesto: 1, nombre_pieza: 'Product 1' },
      { id_repuesto: 2, nombre_pieza: 'Product 2' }
    ]));

    eliminarProducto(1, 'Product 1');

    const carrito = JSON.parse(mockLocalStorage.store['carrito_123']);
    expect(carrito).toHaveLength(1);
    expect(carrito[0].id_repuesto).toBe(2);
  });

  it('actualiza la cantidad de un producto', async () => {
    const mockProducto = {
      id_repuesto: 1,
      nombre_pieza: 'Test Product',
      cantidad_pieza: '10',
      precio_pieza: '100'
    };

    axios.get.mockResolvedValueOnce({ data: [mockProducto] });
    mockLocalStorage.setItem('userId', '123');
    mockLocalStorage.setItem('carrito_123', JSON.stringify([{
      ...mockProducto,
      cantidad: 1
    }]));

    await actualizarCantidad(1, 'Test Product', 5);

    const carrito = JSON.parse(mockLocalStorage.store['carrito_123']);
    expect(carrito[0].cantidad).toBe(5);
  });

  it('no permite una cantidad mayor al stock disponible', async () => {
    const mockProducto = {
      id_repuesto: 1,
      nombre_pieza: 'Test Product',
      cantidad_pieza: '5',
      precio_pieza: '100'
    };

    axios.get.mockResolvedValueOnce({ data: [mockProducto] });
    mockLocalStorage.setItem('userId', '123');
    mockLocalStorage.setItem('carrito_123', JSON.stringify([{
      ...mockProducto,
      cantidad: 1
    }]));

    await expect(actualizarCantidad(1, 'Test Product', 10))
      .rejects
      .toThrow('No hay suficiente stock disponible');
  });
}); 