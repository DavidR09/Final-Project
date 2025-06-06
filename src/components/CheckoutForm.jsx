import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import './CheckoutForm.css';

const CheckoutForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [metodoPago, setMetodoPago] = useState('tarjeta');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Obtener los productos del carrito desde localStorage
      const userId = localStorage.getItem('userId');
      const carritoKey = `carrito_${userId}`;
      const productosCarrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

      const response = await fetch('http://localhost:3000/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          items: productosCarrito,
          amount: amount // Agregar el monto total
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Crear PaymentIntent
      const { clientSecret } = data;

      // Confirmar el pago
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error en el pago',
          text: result.error.message,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Pago exitoso!',
          text: 'Tu pago ha sido procesado correctamente.',
        });
        onSuccess({
          estado_pago: 1,
          metodo_pago: metodoPago,
          monto_pago: amount,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al procesar tu pago.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="form-group">
        <label>Método de Pago</label>
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
          className="select-metodo-pago"
        >
          <option value="tarjeta">Tarjeta de Crédito/Débito</option>
        </select>
      </div>

      <div className="form-group">
        <label>Detalles de la Tarjeta</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="pagar-btn"
      >
        {loading ? 'Procesando...' : `Pagar RD$ ${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm; 