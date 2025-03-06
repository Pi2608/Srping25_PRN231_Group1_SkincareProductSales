import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../Components/Header/Header';
import Footer from '../../../Components/Footer/Footer';
import { ProductsData } from '../../../data/products';
import { useAuth } from '../../../AuthContext/AuthContext';
import './ProductsPage.css';
import CardProduct from '../../../Components/CardProduct/CardProduct';

const ProductsPage = ()=>{
    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginRedirect = () => {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    };

    const { user } = useAuth();
    const [MenuProducts, setMenuProducts] = useState(ProductsData)
    
    const filter = (type) => {
        setMenuProducts(ProductsData.filter((product)=>product.type === type))
    }

    return(
        <div id='product-page'>
            <Header/>
                <div className='product-container'>
                    <ul className='type'>
                        <li onClick={() => setMenuProducts(ProductsData)} className='menu'>All</li>
                        <li onClick={() => filter("skin care")} className='menu'>Skin Care</li>
                        <li onClick={() => filter("conditioner")} className='menu'>Conditioners</li>
                        <li onClick={() => filter("foundation")} className='menu'>Foundations</li>
                    </ul>
        
        
                    <div className='items'>
                        {MenuProducts.map((product, i) => (
                            <CardProduct product={product}/>
                        ))
                        }
                    </div>
                </div>
            <Footer/>
        </div>
    )
}

export default ProductsPage;