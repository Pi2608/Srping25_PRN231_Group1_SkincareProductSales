import React from 'react'
import { useAuth } from '../../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CardProduct.css'

const CardProduct = ({ product, handleLoginRedirect }) => {
    
    const { user } = useAuth();
    const navigate = useNavigate();

    const addToCart = (product) => {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

        const existingProduct = cart.find((item) => item.id === product.id);
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));

        toast.success(`${product.name} has been added to your cart!`);
    };

    return (
        <div id='card_product' onClick={() => navigate(`/product/${product.id}`)}>
            <div className="img-container">
                <img 
                    src={product.image} 
                    alt=""
                />
            </div>

            <div className='info-container'>
                <div className='product-info'>
                    <span className='name'>{product.name} <br></br></span>
                    <span className='details'>{product.detail}</span>
                </div>
                <span className='price'>{new Intl.NumberFormat('vi-VN').format(product.details.price*1000)}VND</span>
                <div className='buy-btn' onClick={(e) => {
                    e.stopPropagation(); 
                    // user ?  {} : handleLoginRedirect();
                    addToCart(product);
                }}>Buy Now</div>
            </div>
        </div>
    )
}

export default CardProduct