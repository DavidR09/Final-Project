import React, { useState } from 'react';
import CheckoutForm from './CheckoutForm';
import TallerSelector from './TallerSelector';
import './PaymentModal.css';

const PaymentModal = ({ isOpen, onClose, amount, onPaymentSuccess }) => {
  const [selectedTaller, setSelectedTaller] = useState(null);

  const handlePaymentSuccess = (paymentDetails) => {
    onPaymentSuccess({
      ...paymentDetails,
      taller: selectedTaller
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
            <h3>1. Seleccionar Taller</h3>
            <TallerSelector onSelect={setSelectedTaller} />
          </div>

          {selectedTaller && (
            <div className="step">
              <h3>2. Información de Pago</h3>
              <div className="amount-display">
                <p>Subtotal: RD$ {amount.toFixed(2)}</p>
                <p>ITBIS (18%): RD$ {(amount * 0.18).toFixed(2)}</p>
                <p className="total">Total: RD$ {(amount * 1.18).toFixed(2)}</p>
              </div>
              <CheckoutForm 
                amount={amount * 1.18} 
                onSuccess={handlePaymentSuccess}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 