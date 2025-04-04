import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../../Components/Header/Header';
import Footer from '../../../Components/Footer/Footer';
import CartItem from '../../../Components/CartItem/CartItem';
import ApiGateway from '../../../Api/ApiGateway';
import { useAuth } from '../../../AuthContext/AuthContext';
import './Cart.css';

const Cart = () => {

    const navigate = useNavigate();
    const { user, fetchUser } = useAuth();

    const [cart, setCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showVouchers, setShowVouchers] = useState(false);
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    useEffect(() => {
        if(user){
            console.log(user)
        }
        const storedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await ApiGateway.getAllVouchers();
                setVouchers(response);
            } catch (error) {
                console.error('Failed to fetch vouchers:', error);
            }
        };
        
        fetchVouchers();
    }, []);

    const createOrder = async () => {
        // Check if user has enough money
        if (finalPrice > user?.moneyAmount) {
            toast.error('You do not have enough money to place this order.');
            return;
        }
        
        try {
            console.log(selectedItems);
            console.log(selectedVoucher);
            const response = await ApiGateway.createOrder(selectedItems, selectedVoucher?.code);
            
            toast.success('Order placed successfully! Your order ID is ' + response.id, {
                autoClose: 500,
            });
            
            const remainingItems = cart.filter(item => 
                !selectedItems.some(selected => selected.productId === item.id)
            );
            
            setCart(remainingItems);
            sessionStorage.setItem('cart', JSON.stringify(remainingItems));
            
            setSelectedItems([]);
            setSelectedVoucher(null);
            
            setTimeout(() => {
                navigate('/profile/orders');
                fetchUser();
            }, 1000);
        } catch (error) {
            toast.error('Failed to place order. Please try again later.');
        }
    }

    const updateQuantity = (id, change) => {
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        );
        setCart(updatedCart);
        sessionStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeItem = (id, name) => {
        if (window.confirm(`Are you sure you want to remove "${name}" from your cart?`)) {
            const updatedCart = cart.filter((item) => item.id !== id);
            setCart(updatedCart);
            sessionStorage.setItem('cart', JSON.stringify(updatedCart));

            setSelectedItems((prev) => prev.filter((item) => item.productId !== id));

            toast.success(`"${name}" removed from cart!`);
        }
    };

    const toggleSelectItem = (id, quantity, size) => {
        setSelectedItems((prev) => {
            const exists = prev.some(item => item.productId === id);
            
            if (exists) {
                return prev.filter(item => item.productId !== id);
            } else {
                return [...prev, { productId: id, quantity, size, isDeleted: false }];
            }
        });
    };

    const toggleVouchers = () => {
        setShowVouchers(!showVouchers);
    };

    const applyVoucher = (voucher) => {
        if (parseInt(voucher.minimumOrderTotalPrice) > parseInt(finalPrice)) {
            toast.error(`Order final price must more than ${new Intl.NumberFormat('vi-VN').format(voucher.minimumOrderTotalPrice)}VND!`);   
        } else {
            setSelectedVoucher(voucher);
            setShowVouchers(false);
            toast.success(`Voucher ${voucher.code} selected!`);
        }
    };

    const selectedSubtotal = cart
        .filter((item) => selectedItems.some(selected => selected.productId === item.id))
        .reduce((acc, item) => acc + (item.details?.price || 0) * item.quantity, 0);
    
    const calculateFinalPrice = () => {
        if (!selectedVoucher) return selectedSubtotal;
        
        const discountAmount = (selectedSubtotal * selectedVoucher.discountPercentage) / 100;
        return Math.max(0, selectedSubtotal - discountAmount);
    };

    const finalPrice = calculateFinalPrice();
    const insufficientFunds = finalPrice > (user?.moneyAmount || 0);

    return (
        <div id='cart'>
            <Header />
            <div className="cart-container">
                <h1 className="cart-title">My Cart</h1>
                <div className="all-items">
                    <div className="items">
                        {cart.length > 0 ? (
                            cart.map((item, i) => (
                                <CartItem 
                                    key={i}
                                    {...item}
                                    updateQuantity={updateQuantity}
                                    removeItem={removeItem}
                                    toggleSelectItem={toggleSelectItem}
                                    isSelected={selectedItems.some(selected => selected.productId === item.id)}
                                />
                            ))
                        ) : (
                            <p className="empty-cart">Your cart is empty!</p>
                        )}
                    </div>
                    <div className="cart-summary">
                        <h2>Summary Order</h2>
                        <p>Subtotal: {new Intl.NumberFormat('vi-VN').format(selectedSubtotal)} VND</p>
                        
                        {user && (
                            <p className="available-balance">
                                Your Balance: {new Intl.NumberFormat('vi-VN').format(user.moneyAmount || 0)} VND
                            </p>
                        )}
                        
                        {/* Voucher section */}
                        <div className="voucher-section">
                            <button 
                                className="use-voucher-btn" 
                                onClick={toggleVouchers}
                            >
                                {showVouchers ? 'Hide Vouchers' : 'Use Voucher'}
                            </button>
                            
                            {selectedVoucher && (
                                <div className="selected-voucher">
                                    <p>Applied: {selectedVoucher.code} ({selectedVoucher.discountPercentage}% off)</p>
                                    <button 
                                        className="remove-voucher-btn"
                                        onClick={() => setSelectedVoucher(null)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            
                            <div className={`vouchers-list ${showVouchers ? 'show' : ''}`}>
                                {vouchers.length > 0 ? (
                                    vouchers.filter(vc => new Date(vc.expiredDate) > new Date()).map((voucher) => (
                                        <div 
                                            key={voucher.id} 
                                            className="voucher-item"
                                            onClick={() => applyVoucher(voucher)}
                                        >
                                            <div className="voucher-code">
                                                {voucher.code} - Expires: {new Date(voucher.expiredDate).toLocaleDateString('vi-VN')}
                                            </div>
                                            <div className="voucher-discount">{voucher.discountPercentage}% off for order total price more than {new Intl.NumberFormat('vi-VN').format(voucher.minimumOrderTotalPrice)}VND</div>
                                            <div className="voucher-description">{voucher.description}</div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No vouchers available</p>
                                )}
                            </div>
                        </div>
                        
                        {selectedVoucher && (
                            <p className="discount-amount">
                                Discount: -{new Intl.NumberFormat('vi-VN').format((selectedSubtotal * selectedVoucher.discountPercentage / 100))} VND
                            </p>
                        )}
                        
                        <p className="final-price">
                            <strong>Final Price: {new Intl.NumberFormat('vi-VN').format(finalPrice)} VND</strong>
                        </p>
                        
                        {insufficientFunds && selectedItems.length > 0 && (
                            <p className="insufficient-funds-warning">
                                Warning: You don't have enough money for this purchase.
                            </p>
                        )}
                        
                        <button 
                            className="cart-checkout" 
                            disabled={selectedItems.length === 0 || insufficientFunds}
                            onClick={() => createOrder()}
                        >
                            Buy Now ({selectedItems.length})
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
            <Footer />
        </div>
    );
}

export default Cart;    