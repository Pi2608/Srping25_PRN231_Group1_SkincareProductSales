import React, { useState } from "react";
import "./ProductDetail.css";
import Header from "../../../Components/Header/Header";
import Footer from "../../../Components/Footer/Footer";

const ProductDetail = () => {
    const [selectedSize, setSelectedSize] = useState("100ml");
    const [quantity, setQuantity] = useState(1);

    return (
        <div id="product-detail">
            <Header />
            <div className="product-container">
                <div className="product-image">
                    <span className="badge">Best Seller</span>
                    {/* <img src={productImage} alt="Oh My Bod! Sunscreen" /> */}
                    <div className="img"></div>
                </div>

                <div className="product-details">
                    <h4 className="brand">EVERYDAY HUMANS</h4>
                    <h1 className="title">Oh My Bod! Sunscreen Lotion</h1>
                    <div className="rating">
                        ⭐⭐⭐⭐⭐ <span>214 reviews</span>
                    </div>
                    <div className="price">
                        <span className="current-price">$16.00</span>
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
