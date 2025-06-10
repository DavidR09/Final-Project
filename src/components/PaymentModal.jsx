import React, { useState, useEffect } from 'react';
import CheckoutForm from './CheckoutForm';
import TallerSelector from './TallerSelector';
import './PaymentModal.css';
import Swal from 'sweetalert2';
import axios from 'axios';

const PaymentModal = ({ isOpen, onClose, amount, onConfirm, onPaymentDetailsChange, onTallerSelect }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedTaller, setSelectedTaller] = useState(null);
  const [userHasTaller, setUserHasTaller] = useState(true); // Por defecto asumimos que sí tiene

  useEffect(() => {
    const checkUserTaller = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/talleres/usuario/${userId}`);
        setUserHasTaller(response.data && response.data.length > 0);
      } catch (error) {
        console.error('Error al verificar taller del usuario:', error);
        setUserHasTaller(false);
      }
    };

    checkUserTaller();
  }, []);

  const handlePaymentMethodSelect = async (method) => {
    console.log('1. Iniciando selección de método de pago:', method);
    
    if (userHasTaller && !selectedTaller) {
      await Swal.fire({
        icon: 'error',
        title: 'Taller requerido',
        text: 'Por favor selecciona un taller antes de continuar con el pago.',
        confirmButtonColor: '#24487f'
      });
      return;
    }

    try {
      console.log('2. Actualizando estado local con método:', method);
      setPaymentMethod(method);
      
      console.log('3. Llamando a onPaymentDetailsChange con método:', method);
      const paymentInfo = { method: method };
      const result = await onPaymentDetailsChange(paymentInfo);
      console.log('4. Resultado de onPaymentDetailsChange:', result);

      // Esperamos un momento para asegurar que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('5. Verificando método después de la espera:', method);
      if (method === 'efectivo') {
        console.log('6. Procesando pago en efectivo');
        onConfirm();
        onClose();
      } else if (method === 'tarjeta') {
        console.log('6. Mostrando formulario de tarjeta');
        setShowPaymentForm(true);
      }
    } catch (error) {
      console.error('Error al procesar el método de pago:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al procesar el método de pago. Por favor intenta nuevamente.',
        confirmButtonColor: '#24487f'
      });
    }
  };

  const handleTallerSelect = (taller) => {
    setSelectedTaller(taller);
    onTallerSelect(taller);
  };

  const handleCardPayment = async () => {
    try {
      // Actualizamos el estado del padre
      onPaymentDetailsChange({ method: 'tarjeta' });

      // Esperamos un momento para asegurar que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 100));

      onConfirm();
      onClose();
    } catch (error) {
      console.error('Error al procesar el pago con tarjeta:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2>Finalizar Compra</h2>
        
        <div className="payment-steps">
          <div className="step">
            <div className="amount-display">
              <p>Subtotal: RD$ {amount.toFixed(2)}</p>
              <p>ITBIS (18%): RD$ {(amount * 0.18).toFixed(2)}</p>
              <p className="total">Total con ITBIS: RD$ {(amount * 1.18).toFixed(2)}</p>
            </div>

            {userHasTaller && (
              <div className="taller-selection">
                <h3>Selección de Taller (Requerido)</h3>
                <TallerSelector onSelect={handleTallerSelect} />
                {!selectedTaller && (
                  <p className="error-message">Debe seleccionar un taller antes de continuar</p>
                )}
              </div>
            )}
            
            <div className="payment-methods">
              <button 
                className={`payment-method-btn ${paymentMethod === 'efectivo' ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect('efectivo')}
                disabled={userHasTaller && !selectedTaller}
              >
                Pago en Efectivo
              </button>
              <button 
                className={`payment-method-btn ${paymentMethod === 'tarjeta' ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect('tarjeta')}
                disabled={userHasTaller && !selectedTaller}
              >
                Pago con Tarjeta
              </button>
            </div>

            {showPaymentForm && paymentMethod === 'tarjeta' && (
              <div className="card-payment-form">
                <CheckoutForm 
                  amount={amount * 1.18} 
                  onSuccess={handleCardPayment}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 