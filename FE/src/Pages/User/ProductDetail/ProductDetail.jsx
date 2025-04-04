import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header/Header";
import Footer from "../../../Components/Footer/Footer";
import Rating from '@mui/material/Rating';
import ApiGateway from "../../../Api/ApiGateway";
import { useAuth } from "../../../AuthContext/AuthContext";
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetail.css";

const ProductDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { productId } = useParams();
    const { user } = useAuth();

    const [product, setProduct] = useState();
    const [productDetails, setProductDetails] = useState();
    const [selectedSize, setSelectedSize] = useState("100ml");
    const [selectedDetail, setSelectedDetail] = useState();
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        setProduct();
        setQuantity(1);
        setSelectedSize("100ml");
        
        if (productId) {
            console.log("Product ID:", productId);
            fetchProductById(productId).then((product) => {
                if (product) { 
                    setProduct(product);
                    setProductDetails(product.details);
                    setSelectedDetail(product.details[0]);
                    setSelectedSize(product.details?.[0].size || "100ml");
                }
            });
            fetchProductReviews(productId);
        }
    }, [productId, location.pathname]);

    const fetchProductById = async (id) => {
        try {
            setLoading(true);
            const product = await ApiGateway.getProductById(id);
            const details = await ApiGateway.getProductDetailByProductId(id);
            return { ...product, details };
        } catch (error) {
            console.error(`Failed to fetch product ${id}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductReviews = async (id) => {
        try {
            const fetchedReviews = await ApiGateway.getFeedbackByProduct(id);
            setReviews(fetchedReviews);
            console.log(fetchedReviews);
        } catch (error) {
            console.error(`Failed to fetch reviews for product ${id}:`, error);
        }
    };

    const handleSubmitReview = async () => {
        // Validate review
        if (!user) {
            toast.error("Please log in to submit a review");
            return;
        }

        if (newReview.rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        if (!newReview.comment.trim()) {
            toast.error("Please write a review comment");
            return;
        }

        try {
            const reviewData = {
                productId: productId,
                rating: newReview.rating,
                review: newReview.comment,
                isDeleted: false
            };

            const response = await ApiGateway.createFeedback(reviewData);
            
            // Refresh reviews
            await fetchProductReviews(productId);
            
            // Reset new review form
            setNewReview({ rating: 0, comment: '' });
            
            // Show success message from backend
            toast.success(response || "Review submitted successfully!");
        } catch (error) {
            // Display error message from backend
            toast.error(error || "Failed to submit review");
        }
    };

    const handleLoginRedirect = () => {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    };

    const addToCart = () => {
        if (!user) {
            displayMsg();
            return;
        }
        
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
        // Create a cart item with the product and its selected detail
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.image,
            shortDescription: product.shortDescription,
            categories: product.categories,
            details: selectedDetail,
            quantity: quantity
        };
        
        // Check if this product with the same detail already exists in cart
        const existingProductIndex = cart.findIndex(item => 
            item.id === product.id && item.details?.id === selectedDetail?.id
        );
        
        if (existingProductIndex >= 0) {
            // If exists, just update the quantity
            cart[existingProductIndex].quantity += quantity;
        } else {
            // Otherwise add the new product with its detail
            cart.push(cartItem);
        }
    
        sessionStorage.setItem('cart', JSON.stringify(cart));
    
        toast.success(`${quantity}x ${product.name} (${selectedSize}ml) has been added to your cart!`);
    };
    
    const buyNow = () => {
        if (!user) {
            displayMsg();
            return;
        }
        
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
        // Create a cart item with the product and its selected detail
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.image,
            shortDescription: product.shortDescription,
            categories: product.categories,
            details: selectedDetail,
            quantity: quantity
        };
        
        // Check if this product with the same detail already exists in cart
        const existingProductIndex = cart.findIndex(item => 
            item.id === product.id && item.details?.id === selectedDetail?.id
        );
        
        if (existingProductIndex >= 0) {
            // If exists, just update the quantity
            cart[existingProductIndex].quantity += quantity;
        } else {
            // Otherwise add the new product with its detail
            cart.push(cartItem);
        }
    
        sessionStorage.setItem('cart', JSON.stringify(cart));
    
        toast.success(`${quantity}x ${product.name} (${selectedSize}ml) has been added to your cart!`);
        navigate('/cart');
    };

    const displayMsg = () => {
        toast(<Msg handleLoginRedirect={handleLoginRedirect} />);
    };

    const calculateAverageRating = (reviews) => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / reviews.length;
    };

    const setCurrentDetail = (size) => {
        const detail = productDetails.find((detail) => detail.size === size);
        setSelectedSize(size)
        setSelectedDetail(detail);
    }
    
    return (
        <div id="product-detail">
            <Header />
            <ToastContainer autoClose={3000}/>
            <div className="redirect-bar">
                <button className="back" onClick={() => {navigate(-1); setProduct({})}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M3.076 5.617A1 1 0 0 1 4 5h10a7 7 0 1 1 0 14H5a1 1 0 1 1 0-2h9a5 5 0 1 0 0-10H6.414l1.793 1.793a1 1 0 0 1-1.414 1.414l-3.5-3.5a1 1 0 0 1-.217-1.09"/></g></svg>
                    Back
                </button>
            </div>
            <div className="product-container">
                {loading ? 
                    <div className="loading">
                        <CircularProgress />
                    </div> 
                    : 
                    <div className="product">
                        <div className="product-image">
                            <img src={product?.image} alt={product?.name} />
                        </div>

                        <div className="product-details">
                            {/* <h4 className="brand">{product?.detail}</h4> */}
                            <h1 className="title">{product?.name}</h1>
                            <div className="rating">
                                <Rating name="read-only" value={calculateAverageRating(reviews)} precision={0.5}  readOnly />
                                <span>{reviews.length} review{reviews.length > 1 && 's'}</span>
                            </div>
                            <div className="price">
                                <span className="current-price">{new Intl.NumberFormat('vi-VN').format(selectedDetail?.price)} VND</span>
                            </div>
                            <p className="description">
                                {selectedDetail?.description}
                            </p>

                            <div className="size-selector">
                                <span>Size:</span>
                                {productDetails?.map((detail, index) => (
                                    <button className={selectedSize === detail?.size ? "selected" : ""}
                                        onClick={() => setCurrentDetail(detail?.size)}>{detail?.size}ml</button>
                                ))}
                            </div>

                            <div className="stock">
                                <span>Stock: {selectedDetail?.stockQuantity} available</span>
                            </div>

                            <div className="cart-options">
                                <div className="quantity-selector">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>
                                <button className="add-to-cart" onClick={addToCart}>Add to Cart</button>
                                <button className="buy-now" onClick={buyNow}>Buy now</button>
                            </div>
                        </div>
                    </div>
                }
                <div className="reviews-section">
                    <h2>Customer Reviews</h2>

                    {user && (
                        <div className="write-review">
                            <h3>Write a Review</h3>
                            <Rating
                                className="new-review-rating"
                                value={newReview.rating}
                                onChange={(event, newValue) => {
                                    setNewReview(prev => ({...prev, rating: newValue}));
                                }}
                                precision={0.5} 
                            />
                            <textarea 
                                placeholder="Write your review here..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview(prev => ({...prev, comment: e.target.value}))}
                            />
                            <button onClick={handleSubmitReview}>Submit Review</button>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div className="reviews-list">

                        {loading ? 
                            <div className="loading">
                                <CircularProgress/>
                            </div>
                            :
                            reviews.length > 0 ? 
                                reviews.map((review, index) => (
                                    <div key={index} className="review-item">
                                        <div className="review-header">
                                            <span className="reviewer-name">{review.user?.account}</span>
                                            <Rating 
                                                name="read-only" 
                                                value={review.rating} 
                                                readOnly 
                                                precision={0.5} 
                                            />
                                        </div>
                                        <p className="review-comment">{review.review}</p>
                                        <span className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))
                                :
                                <div className="review-item">
                                    <p className="review-comment">There are no comment here</p>
                                </div>
                        }
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
