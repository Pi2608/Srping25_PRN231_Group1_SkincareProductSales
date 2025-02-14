import React, { useState } from 'react'
import Header from '../../../Components/Header/Header'
import Footer from '../../../Components/Footer/Footer'
import CartItem from '../../../Components/CartItem/CartItem'
import { ProductsData } from '../../../data/cart'
import './Cart.css'

const Cart = () => {
    const [cart, setCart] = useState(ProductsData);

    const updateQuantity = (id, change) => {
        setCart((prevCart) =>
        prevCart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        )
        );
    };

    const removeItem = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div id='cart'>
            <Header />
            <div className="cart-container">
                <h1 className="cart-title">My Cart</h1>
                <div className="all-items">
                    <div className="items">
                        {ProductsData.map((item) => (
                            <CartItem 
                                key={item.id}
                                id={item.id}
                                img={item.img}
                                name={item.name}
                                type={item.type}
                                category={item.category}
                                price={item.price}
                                quantity={item.quantity}
                            />
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2>Summary Order</h2>
                        <p>Subtotal: {new Intl.NumberFormat('vi-VN').format(subtotal)} VND</p>
                        <button className="cart-checkout">Buy Now ({cart.length})</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Cart