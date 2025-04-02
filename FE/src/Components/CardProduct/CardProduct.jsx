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
        if (!user) {
            handleLoginRedirect();
            return;
        }

        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        
        // Use the first detail as default when clicking "Buy Now" from card
        const selectedDetail = product.details?.[0];
        
        if (!selectedDetail) {
            toast.error("Product has no available options");
            return;
        }
        
        // Create a cart item with the product and its selected detail
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.image,
            shortDescription: product.shortDescription,
            categories: product.categories,
            details: selectedDetail,
            quantity: 1
        };
        
        // Check if this product with the same detail already exists in cart
        const existingProductIndex = cart.findIndex(item => 
            item.id === product.id && item.details.id === selectedDetail.id
        );
        
        if (existingProductIndex >= 0) {
            // If exists, just update the quantity
            cart[existingProductIndex].quantity += 1;
        } else {
            // Otherwise add the new product with its detail
            cart.push(cartItem);
        }
        
        sessionStorage.setItem('cart', JSON.stringify(cart));
        
        console.log(cart);
        
        toast.success(`${product.name} has been added to your cart!`);
    };

    return (
        <div id='card_product' onClick={() => navigate(`/product/${product.id}`)}>
            <div className="img-container">
                <img 
                    src={product.image} 
                    alt={product.name}
                />
            </div>

            <div className='info-container'>
                <div className='product-info'>
                    <span className='name'>{product.name} <br></br></span>
                    <span className='details'>{product.shortDescription}</span>
                </div>
                <span className='price'>{new Intl.NumberFormat('vi-VN').format(product.details?.[0]?.price)}VND</span>
                <div className='buy-btn' onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                }}>Buy Now</div>
            </div>
        </div>
    )
}

export default CardProduct