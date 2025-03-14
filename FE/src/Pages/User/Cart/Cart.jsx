import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../../Components/Header/Header';
import Footer from '../../../Components/Footer/Footer';
import CartItem from '../../../Components/CartItem/CartItem';
import ApiGateway from '../../../Api/ApiGateway';
import './Cart.css';

const Cart = () => {

    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    const createOrder = async () => {
        try {
            const response = await ApiGateway.createOrder();
            const orderId = response.id;
            console.log(response);
            console.log(selectedItems);
            await ApiGateway.createOrderDetail(orderId, selectedItems);
            toast.success('Order placed successfully! Your order ID is ' + response.id, {
                autoClose: 500,
            });
            setTimeout(() => {
                navigate('/profile/orders');
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

            setSelectedItems((prev) => prev.filter((item) => item.id !== id));

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

    const selectedSubtotal = cart
        .filter((item) => selectedItems.some(selected => selected.productId === item.id))
        .reduce((acc, item) => acc + (item.details?.price || 0) * item.quantity, 0);

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
                        <p>Subtotal: {new Intl.NumberFormat('vi-VN').format(selectedSubtotal * 1000)} VND</p>
                        <button 
                            className="cart-checkout" 
                            disabled={selectedItems.length === 0}
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
