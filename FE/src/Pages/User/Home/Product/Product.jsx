import React, { useState, useEffect } from 'react'
import ApiGateway from '../../../../Api/ApiGateway'
import CardProduct from '../../../../Components/CardProduct/CardProduct'
import { ToastContainer } from 'react-toastify';
import './Product.css'

const Products = () => {
    const [MenuProducts, setMenuProducts] = useState([])
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

    const filter = (type) => {
        setMenuProducts(allProducts.filter((product)=>product.categories?.some((cat) => cat.name === type)))
    }
    
    const handleLoginRedirect = () => {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    };

    return (
        <div id='product'>
            <ToastContainer />
            
            <h1 className='title'>Our Featured Products</h1>

            <div className='product-container'>
                <ul className='type'>
                    <li onClick={() => setMenuProducts(allProducts)} className='menu'>All</li>
                    <li onClick={() => filter("Moisturizers")} className='menu'>Moisturizers</li>
                    <li onClick={() => filter("Cleansers")} className='menu'>Cleansers</li>
                    <li onClick={() => filter("Serums")} className='menu'>Serums</li>
                </ul>


                <div className='items'>
                    {MenuProducts?.map((product, i) => (
                        <CardProduct
                            key={i}
                            product={product}
                            handleLoginRedirect={handleLoginRedirect}
                        />
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Products