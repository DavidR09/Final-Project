import { fixNegativeStock } from '../utils/stockValidation.js';

console.log('Iniciando corrección de stock negativo...');

try {
    await fixNegativeStock();
    console.log('Stock corregido exitosamente');
} catch (error) {
    console.error('Error al corregir el stock:', error);
} finally {
    process.exit();
} 