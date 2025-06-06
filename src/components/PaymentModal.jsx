import React, { useState } from 'react';
import CheckoutForm from './CheckoutForm';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, amount, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'card') {
      setShowPaymentForm(true);
    } else if (method === 'cash') {
      // Para pago en efectivo, proceder directamente
      handlePaymentSuccess({ method: 'efectivo' });
    }
  };

  const handlePaymentSuccess = (paymentDetails) => {
    onPaymentSuccess({
      ...paymentDetails,
      method: paymentDetails.method || 'tarjeta'
    });
    onClose();
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
              <p className="total">Total: RD$ {(amount * 1.18).toFixed(2)}</p>
            </div>
            
            <div className="payment-methods">
              <button 
                className={`payment-method-btn ${paymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect('cash')}
              >
                Pago en Efectivo
              </button>
              <button 
                className={`payment-method-btn ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect('card')}
              >
                Pago con Tarjeta
              </button>
            </div>

            {showPaymentForm && paymentMethod === 'card' && (
              <div className="card-payment-form">
                <CheckoutForm 
                  amount={amount * 1.18} 
                  onSuccess={handlePaymentSuccess}
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