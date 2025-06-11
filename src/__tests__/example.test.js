import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Ejemplo de una prueba simple
describe('Ejemplo de prueba', () => {
  test('2 + 2 debería ser 4', () => {
    expect(2 + 2).toBe(4);
  });
});

// Ejemplo de prueba con componente React (comentado por ahora)
/*
import MiComponente from '../components/MiComponente';

describe('MiComponente', () => {
  test('renderiza correctamente', () => {
    render(<MiComponente />);
    expect(screen.getByText('Texto esperado')).toBeInTheDocument();
  });
});
*/ 