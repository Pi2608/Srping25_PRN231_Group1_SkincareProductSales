import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../../Components/Header/Header';
import Footer from '../../../Components/Footer/Footer';
import ApiGateway from '../../../Api/ApiGateway';
import CardProduct from '../../../Components/CardProduct/CardProduct';
import SearchBox from '../../../Components/SearchBox/SearchBox';
import SearchIcon from '@mui/icons-material/Search';
import './ProductsPage.css';

const ProductsPage = ()=>{
    const navigate = useNavigate();
    const location = useLocation();

    const [MenuProducts, setMenuProducts] = useState([])  
    const [search, setSearch] = useState("")    
    const [allProducts, setAllProducts] = useState([])
    
    useEffect(() => {
        fetchAllProducts().then((products) => {
            const fiterProds = products.filter((prods) => prods.isDeleted === false)
            setMenuProducts(fiterProds);
            setAllProducts(fiterProds);
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
        setMenuProducts(allProducts.filter((product)=>product.categories?.some((cat) => cat.name === type && cat.isDeleted === false)));
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }
    
    const handleSearch = async () => {
        try {
            console.log(search);
        const data = await ApiGateway.searchProducts(search);
        const productsWithDetails = await Promise.all(
            data.map(async (product) => {
                const details = await ApiGateway.getProductDetailByProductId(product.id);
                return { ...product, details };
            })
        );
        setMenuProducts(productsWithDetails);
        console.log(data)
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    return(
        <div id='product-page'>
            <Header/>
            <ToastContainer />

            <div className='product-container'>
                <div style={{display: 'flex', gap: "5px", margin: "0 auto", width: '100%', justifyContent: "center"}}>
                    <input
                        type="text"
                        placeholder="Search products"
                        value={search}
                        onChange={(e) => handleSearchChange(e)}
                        className="search-bar"
                        style={{width: '60%'}}
                    />
                    <button className="search" onClick={() => handleSearch()}><SearchIcon />Search</button>
                    
                </div>

                <ul className='type'>
                    <li onClick={() => setMenuProducts(allProducts)} className='menu'>All</li>
                    <li onClick={() => filter("Moisturizers")} className='menu'>Moisturizers</li>
                    <li onClick={() => filter("Cleansers")} className='menu'>Cleansers</li>
                    <li onClick={() => filter("Serums")} className='menu'>Serums</li>
                </ul>
    
    
                <div className='items'>
                    {MenuProducts.map((product, i) => (
                        <CardProduct 
                            key={i}
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