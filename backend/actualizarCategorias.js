import axios from 'axios';

async function actualizarCategorias() {
  try {
    console.log('Intentando actualizar categorías...');
    const response = await axios.post('https://backend-respuestosgra.up.railway.app/api/productos/actualizar-categorias');
    console.log('Respuesta:', response.data);
  } catch (error) {
    console.error('Error al actualizar categorías:', error.message);
    if (error.response) {
      console.error('Detalles del error:', error.response.data);
    }
  }
}

actualizarCategorias(); 