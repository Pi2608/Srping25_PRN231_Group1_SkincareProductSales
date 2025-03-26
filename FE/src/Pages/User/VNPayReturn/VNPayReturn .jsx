import React, { useEffect, useState } from 'react';
import './VNPayReturn.css';

const VNPayReturn = () => {
    const [status, setStatus] = useState('');
    const [orderId, setOrderId] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const responseCode = params.get('vnp_ResponseCode');
        const txnRef = params.get('vnp_TxnRef');
        const totalAmount = params.get('vnp_Amount');

        setOrderId(txnRef);
        setAmount(totalAmount ? (Number(totalAmount) / 100).toLocaleString('vi-VN') : '0');

        if (responseCode === '00') {
            setStatus('success');
        } else {
            setStatus('fail');
        }
    }, []);

    return (
        <div className="vnpay-container">
            <div className={`vnpay-box ${status}`}>
                <h2>{status === 'success' ? '🎉 Payment successfully!' : '❌ Payment fail!'}</h2>
                <p><strong>Amount Money:</strong> {amount} VND</p>
                <a href="/" className="back-btn">Quay về trang chủ</a>
            </div>
        </div>
    );
};

export default VNPayReturn;
