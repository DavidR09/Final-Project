import { loadStripe } from '@stripe/stripe-js';

// Clave pública de Stripe para el entorno de pruebas
const stripePromise = loadStripe('pk_test_51RWKrkH6czi44GTHIZBHNkFz2dBuF3PEC2YqKsetwXKzpSdw76HYusG6RWp6a0HhRVcLUOWjv3wjCfH1WP01ym9q00ZWqpV81v');

export default stripePromise; 