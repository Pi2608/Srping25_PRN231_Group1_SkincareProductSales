import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header/Header";
import Footer from "../../../Components/Footer/Footer";
import Rating from '@mui/material/Rating';
import ApiGateway from "../../../Api/ApiGateway";
import { useAuth } from "../../../AuthContext/AuthContext";
import { ProductsData } from '../../../data/products';
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetail.css";

const ProductDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { productId } = useParams();
    const { user } = useAuth();

    const [product, setProduct] = useState({});
    const [selectedSize, setSelectedSize] = useState("100ml");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (productId) {
            fetchProductById(productId).then((product) => {
                setProduct(product);
                setSelectedSize(product.details?.size);
                console.log(product);
            });
        }
    }, []);

    const fetchProductById = async (id) => {
        try {
            const product = await ApiGateway.getProductById(id);
            const details = await ApiGateway.getProductDetailByProductId(product.id);
            return { ...product, details };
        } catch (error) {
            console.error(`Failed to fetch product ${id}:`, error);
        }
    };

    const handleLoginRedirect = () => {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    };

    const addToCart = () => {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

        const existingProduct = cart.find((item) => item.id === product.id && item.size === selectedSize);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ ...product, size: selectedSize, quantity });
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));

        toast.success(`${quantity}x ${product.name} (${selectedSize}) has been added to your cart!`);
    };

    const buyNow = () => {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

        const existingProduct = cart.find((item) => item.id === product.id && item.size === selectedSize);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ ...product, size: selectedSize, quantity });
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));

        toast.success(`${quantity}x ${product.name} (${selectedSize}) has been added to your cart!`);
        navigate('/cart');
    };

    const displayMsg = () => {
        toast(<Msg handleLoginRedirect={handleLoginRedirect} />);
    };

    return (
        <div id="product-detail">
            <Header />
            <ToastContainer autoClose={3000}/>
            <div className="redirect-bar">
                <button className="back" onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M3.076 5.617A1 1 0 0 1 4 5h10a7 7 0 1 1 0 14H5a1 1 0 1 1 0-2h9a5 5 0 1 0 0-10H6.414l1.793 1.793a1 1 0 0 1-1.414 1.414l-3.5-3.5a1 1 0 0 1-.217-1.09"/></g></svg>
                    Back
                </button>
            </div>
            <div className="product-container">
                <div className="product-image">
                    <img src={product.image} alt={product.name} />
                </div>

                <div className="product-details">
                    <h4 className="brand">{product.detail}</h4>
                    <h1 className="title">{product.name}</h1>
                    <div className="rating">
                        <Rating name="read-only" value={5} readOnly />
                        <span>214 reviews</span>
                    </div>
                    <div className="price">
                        <span className="current-price">{new Intl.NumberFormat('vi-VN').format(product.details?.price*1000)} VND</span>
                    </div>
                    <p className="description">
                        {product.shortDescription}
                    </p>

                    <div className="size-selector">
                        <span>Size:</span>
                        <button className={selectedSize === product.details?.size ? "selected" : ""}
                            onClick={() => setSelectedSize(product.details?.size)}>{product.details?.size}ml</button>
                    </div>

                    <div className="cart-options">
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <button className="add-to-cart" onClick={() =>user ? addToCart() : displayMsg() }>Add to Cart</button>
                        <button className="buy-now" onClick={() =>user ? buyNow() : displayMsg() }>Buy now</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

const Msg = ({ closeToast, handleLoginRedirect }) => (
    <div className="toast-message">
        <p>You need to log in to continue.</p>
        <div>
            <button className="login-btn" onClick={handleLoginRedirect}>Login</button>
            <button className="close-btn" onClick={closeToast}>Close</button>
        </div>
    </div>
);

export default ProductDetail;
