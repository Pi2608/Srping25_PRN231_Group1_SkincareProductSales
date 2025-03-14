import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../../Components/Header/Header';
import Footer from '../../../Components/Footer/Footer';
import ApiGateway from '../../../Api/ApiGateway';
import CardProduct from '../../../Components/CardProduct/CardProduct';
import { ProductsData } from '../../../data/products';
import './ProductsPage.css';

const ProductsPage = ()=>{
    const navigate = useNavigate();
    const location = useLocation();

    const [MenuProducts, setMenuProducts] = useState([])
    
    useEffect(() => {
        fetchAllProducts().then((products) => {
            setMenuProducts(products);
            console.log(products);
        });
    }, []);

    const fetchAllProducts = async () => {
        try {
            const products = await ApiGateway.getAllProducts();
            
            console.log(products);

            const productsWithDetails = await Promise.all(
                products.map(async (product) => {
                    const details = await ApiGateway.getProductDetailByProductId(product.id);
                    return { ...product, details };
                })
            );

            return productsWithDetails;
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    const handleLoginRedirect = () => {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    };
    
    const filter = (type) => {
        setMenuProducts(ProductsData.filter((product)=>product.type === type))
    }

    return(
        <div id='product-page'>
            <Header/>
            <ToastContainer />
            <div className='product-container'>
                <ul className='type'>
                    <li onClick={() => setMenuProducts(MenuProducts)} className='menu'>All</li>
                    <li onClick={() => filter("skin care")} className='menu'>Skin Care</li>
                    <li onClick={() => filter("conditioner")} className='menu'>Conditioners</li>
                    <li onClick={() => filter("foundation")} className='menu'>Foundations</li>
                </ul>
    
    
                <div className='items'>
                    {MenuProducts.map((product, i) => (
                        <CardProduct 
                            product={product}
                            handleLoginRedirect={handleLoginRedirect}
                        />
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default ProductsPage;