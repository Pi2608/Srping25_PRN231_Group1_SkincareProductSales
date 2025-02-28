import React, { useState, useEffect } from "react";
import "./ProductDetail.css";
import { useParams } from "react-router-dom";
import Header from "../../../Components/Header/Header";
import Footer from "../../../Components/Footer/Footer";
import { ProductsData } from '../../../data/products';

const ProductDetail = () => {
    const [selectedSize, setSelectedSize] = useState("100ml");
    const [quantity, setQuantity] = useState(1);

    const { productId } = useParams();
    const product = ProductsData.find(p => p.id == productId);

    if (!product) {
        return <div>Product not found.</div>;
    }

    useEffect(() => {
        // window.screen.scrollTo(0,0);
        window.scrollTo(0,0);
    },[])

    return (
        <div id="product-detail">
            <Header />
            <div className="product-container">
                <div className="product-image">
                    {/* <span className="badge">Best Seller</span> */}
                    <img src={product.img} alt={product.name}/>
                    {/* <div className="img"></div> */}
                </div>

                <div className="product-details">
                    <h4 className="brand">{product.detail}</h4>
                    <h1 className="title">{product.name}</h1>
                    <div className="rating">
                        ⭐⭐⭐⭐⭐ <span>214 reviews</span>
                    </div>
                    <div className="price">
                        <span className="current-price">{new Intl.NumberFormat('vi-VN').format(product.price)} VND</span>
                        {/* <span className="old-price">$20.00</span>
                        <span className="discount">20% OFF</span> */}
                    </div>
                    <p className="description">
                        A reliable bodyguard for your skin, with secret uses. This lightweight, long-lasting SPF50 sunscreen lotion protects against UV exposure.
                    </p>
                    <div className="size-selector">
                        <span>Size:</span>
                        <button className={selectedSize === "50ml" ? "selected" : ""}
                            onClick={() => setSelectedSize("50ml")}>50ml</button>
                        <button className={selectedSize === "100ml" ? "selected" : ""}
                            onClick={() => setSelectedSize("100ml")}>100ml</button>
                    </div>
                    <div className="cart-options">
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <button className="add-to-cart">Add to Cart</button>
                    </div>
                    {/* <p className="shipping-info">Ships for free the week of February 14th.</p> */}

                    {/* Icons */}
                    {/* <div className="icons">
                        <span>✔ Safe & Non-toxic</span>
                        <span>✔ Dermatologist Created</span>
                        <span>✔ Biodegradable</span>
                        <span>✔ Vegan & Cruelty-free</span>
                    </div> */}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;
