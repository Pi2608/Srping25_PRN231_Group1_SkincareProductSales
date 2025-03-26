import React, { useState } from 'react';
import ProfileLayout from '../ProfileLayout/ProfileLayout';
import './TopupPage.css';

const TopupPage = () => {
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [error, setError] = useState('');

  const MIN_TOPUP = 50000;
  const MAX_TOPUP = 1000000000;

  const paymentMethods = [
    { id: 'VNPay', name: 'VNPay', icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="none" stroke="currentColor" stroke-linejoin="round" d="m28.622 37.722l14.445-14.444c.577-.578.577-1.733 0-2.311L34.4 12.3c-.578-.578-1.733-.578-2.311 0l-6.356 6.356L16.49 9.41c-.578-.578-1.734-.578-2.311 0l-9.245 9.245c-.578.577-.578 1.733 0 2.31L21.69 37.723c1.733 1.734 5.2 1.734 6.933 0Z" stroke-width="1"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="m25.733 18.656l-8.089 8.089q-3.466 3.465-6.933 0" stroke-width="1"/><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"><path d="M18.222 30.789q-1.732 1.734-3.467 0m22.534-15.6c-1.262-1.156-2.89-.578-4.045.578L18.222 30.789m0-15.022c-4.622-4.622-10.4 1.155-5.778 5.778l5.2 5.2l-5.2-5.2m10.978-.578l-4.044-4.045"/><path d="m21.689 22.7l-4.622-4.622c-.578-.578-1.445-1.445-2.311-1.156m0 3.467c-.578-.578-1.445-1.444-1.156-2.311m5.778 6.933l-4.622-4.622"/></g></svg> },
    // { id: 'MOMO', name: 'MOMO', icon: <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle cx="34.571" cy="13.429" r="7.929" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5.5 21.357V9.466c0-1.985 1.851-3.964 3.965-3.964c2.119 0 3.965 1.978 3.965 3.964v11.891" stroke-width="1"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M13.429 9.465c0-1.985 1.85-3.964 3.964-3.964c2.119 0 3.965 1.978 3.965 3.964v11.891M5.5 42.5V30.608c0-1.985 1.85-3.965 3.964-3.965c2.119 0 3.965 1.979 3.965 3.965V42.5m0-11.892c0-1.985 1.85-3.965 3.964-3.965c2.119 0 3.965 1.979 3.965 3.965V42.5" stroke-width="1"/><circle cx="34.571" cy="34.571" r="7.929" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"/></svg> },
  ];

  const formatNumber = (num) => {
    const cleanNum = num.replace(/[^0-9]/g, '');
    return cleanNum ? Number(cleanNum).toLocaleString('vi-VN') : '';
  };

  const handleAmountChange = (e) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, '');
    const numAmount = numericValue ? Number(numericValue) : '';
    
    setAmount(numAmount);
    setDisplayAmount(formatNumber(inputValue));
    
    if (numAmount && numAmount < MIN_TOPUP) {
      setError(`Minimum topup amount is ${MIN_TOPUP.toLocaleString('vi-VN')} VND`);
    } else if (numAmount && numAmount > MAX_TOPUP) {
      setError(`Maximum topup amount is ${MAX_TOPUP.toLocaleString('vi-VN')} VND`);
    } else {
      setError('');
    }
  };

  const handleTopup = async () => {
    if (!amount) {
      setError('Please enter an amount');
      return;
    }

    if (amount < MIN_TOPUP) {
      setError(`Minimum topup amount is ${MIN_TOPUP.toLocaleString('vi-VN')} VND`);
      return;
    }

    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    if (selectedMethod === 'VNPay') {
      try {
        // Assuming you have a .NET backend endpoint
        const response = await axios.post('/api/vnpay/create-payment', {
          amount: amount,
          orderId: `ORDER_${Date.now()}`, // Generate unique order ID
          orderInfo: 'Wallet Top-up'
        });

        // Redirect to VNPay payment URL
        window.location.href = response.data;
      } catch (error) {
        console.error('VNPay payment URL creation failed', error);
        setError('Failed to initiate payment. Please try again.');
      }
    }
  };

  return (
    <ProfileLayout>
      <main id="topup">
        <h1>Top Up Wallet</h1>
        <div className="content">
          <div className="amount-input-container">
            <label htmlFor="amount">Enter Amount (VND)</label>
            <input 
              type="text" 
              id="amount"
              value={displayAmount}
              onChange={handleAmountChange}
              placeholder={`Minimum ${MIN_TOPUP.toLocaleString('vi-VN')} VND`}
              className="amount-input"
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            <div className="method-grid">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`payment-method ${method.id} ${selectedMethod === method.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <span className="method-icon">{method.icon}</span>
                  <span className="method-name"><strong>{method.name}</strong></span>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="topup-button" 
            onClick={handleTopup}
            disabled={!amount || !selectedMethod || !!error}
          >
            Top Up Now
          </button>
        </div>
      </main>
    </ProfileLayout>
  );
};

export default TopupPage;