import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../../Components/Header/Header';
import Footer from '../../../Components/Footer/Footer';
import CartItem from '../../../Components/CartItem/CartItem';
import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());

    useEffect(() => {
        const storedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

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
            setSelectedItems((prev) => {
                const newSelected = new Set(prev);
                newSelected.delete(id);
                return newSelected;
            });
            sessionStorage.setItem('cart', JSON.stringify(updatedCart));
            toast.success(`"${name}" removed from cart!`);
        }
    };

    const toggleSelectItem = (id) => {
        setSelectedItems((prev) => {
            const newSelected = new Set(prev);
            newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
            return newSelected;
        });
    };

    const selectedSubtotal = cart
        .filter((item) => selectedItems.has(item.id))
        .reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div id='cart'>
            <Header />
            <div className="cart-container">
                <h1 className="cart-title">My Cart</h1>
                <div className="all-items">
                    <div className="items">
                        {cart.length > 0 ? (
                            cart.map((item) => (
                                <CartItem 
                                    key={item.id}
                                    {...item}
                                    updateQuantity={updateQuantity}
                                    removeItem={removeItem}
                                    toggleSelectItem={toggleSelectItem}
                                    isSelected={selectedItems.has(item.id)}
                                />
                            ))
                        ) : (
                            <p className="empty-cart">Your cart is empty!</p>
                        )}
                    </div>
                    <div className="cart-summary">
                        <h2>Summary Order</h2>
                        <p>Subtotal: {new Intl.NumberFormat('vi-VN').format(selectedSubtotal)} VND</p>
                        <button className="cart-checkout" disabled={selectedItems.size === 0}>
                            Buy Now ({selectedItems.size})
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
