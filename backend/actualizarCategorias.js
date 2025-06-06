import axios from 'axios';

async function actualizarCategorias() {
  try {
    console.log('Intentando actualizar categorías...');
    const response = await axios.post('http://localhost:3000/api/productos/actualizar-categorias');
    console.log('Respuesta:', response.data);
  } catch (error) {
    console.error('Error al actualizar categorías:', error.message);
    if (error.response) {
      console.error('Detalles del error:', error.response.data);
    }
  }
}

actualizarCategorias(); 