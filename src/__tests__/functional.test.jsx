import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Productos from '../components/Productos';
import Carrito from '../components/Carrito';
import Swal from 'sweetalert2';
import axios from 'axios';

// Mock para localStorage
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

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para fetch
global.fetch = jest.fn();

// Mock de axios
jest.mock('axios');

// Mock de SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  showLoading: jest.fn(),
  close: jest.fn()
}));

describe('Pruebas Funcionales', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  test('FUNCIONAL_FLUJO_COMPRA_PRODUCTO', async () => {
    // Mock de datos de productos
    const mockProductos = [
      {
        id_repuesto: 1,
        nombre_pieza: 'Batería 12V',
        precio_pieza: '5500.00',
        cantidad_pieza: '10',
        imagen_pieza: 'bateria.jpg',
        descripcion_pieza: 'Batería de alto rendimiento'
      }
    ];

    // Mock de respuesta de axios
    axios.get.mockResolvedValueOnce({ data: mockProductos });

    // Renderizar componente
    render(<Productos />);

    // Verificar que se cargan los productos
    await waitFor(() => {
      expect(screen.getByText('Batería 12V')).toBeInTheDocument();
    });

    // Verificar que se muestra el precio
    expect(screen.getByText('$5,500.00')).toBeInTheDocument();

    // Simular clic en botón de agregar al carrito
    const agregarButton = screen.getByText('Agregar al Carrito');
    fireEvent.click(agregarButton);

    // Verificar que se muestra el mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText('¡Producto agregado al carrito!')).toBeInTheDocument();
    });

    // Verificar que el producto se agregó al localStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const carritoData = JSON.parse(mockLocalStorage.store['carrito']);
    expect(carritoData).toHaveLength(1);
    expect(carritoData[0].id_repuesto).toBe(1);
  });

  test('FUNCIONAL_ACTUALIZAR_CANTIDAD_CARRITO', async () => {
    // Mock de datos del carrito
    const mockCarrito = [{
      id_repuesto: 1,
      nombre_pieza: 'Batería 12V',
      precio_pieza: 5500.00,
      cantidad: 1,
      stock: 10
    }];

    // Configurar localStorage mock
    mockLocalStorage.store['carrito'] = JSON.stringify(mockCarrito);

    // Renderizar componente
    render(<Carrito />);

    // Verificar que se muestra el producto
    await waitFor(() => {
      expect(screen.getByText('Batería 12V')).toBeInTheDocument();
    });

    // Simular actualización de cantidad
    const incrementButton = screen.getByText('+');
    fireEvent.click(incrementButton);

    // Verificar que se actualizó el localStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
    const carritoData = JSON.parse(mockLocalStorage.store['carrito']);
    expect(carritoData[0].cantidad).toBe(2);
  });

  test('FUNCIONAL_ERROR_STOCK_INSUFICIENTE', async () => {
    // Mock de datos de productos
    const mockProductos = [
      {
        id_repuesto: 1,
        nombre_pieza: 'Batería 12V',
        precio_pieza: '5500.00',
        cantidad_pieza: '1',
        imagen_pieza: 'bateria.jpg',
        descripcion_pieza: 'Batería de alto rendimiento'
      }
    ];

    // Mock de respuesta de axios
    axios.get.mockResolvedValueOnce({ data: mockProductos });

    // Configurar localStorage mock con cantidad máxima
    mockLocalStorage.store['carrito'] = JSON.stringify([{
      id_repuesto: 1,
      nombre_pieza: 'Batería 12V',
      precio_pieza: 5500.00,
      cantidad: 1,
      stock: 1
    }]);

    // Renderizar componente
    render(<Productos />);

    // Verificar que se cargan los productos
    await waitFor(() => {
      expect(screen.getByText('Batería 12V')).toBeInTheDocument();
    });

    // Simular clic en botón de agregar al carrito
    const agregarButton = screen.getByText('Agregar al Carrito');
    fireEvent.click(agregarButton);

    // Verificar que se muestra el mensaje de error
    await waitFor(() => {
      expect(screen.getByText('No hay suficiente stock disponible')).toBeInTheDocument();
    });
  });
}); 