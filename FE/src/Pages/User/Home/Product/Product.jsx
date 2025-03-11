import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductsData } from '../../../../data/products'
import CardProduct from '../../../../Components/CardProduct/CardProduct'
import './Product.css'

const Products = () => {
    const navigate = useNavigate()
    const [MenuProducts, setMenuProducts] = useState(ProductsData)

    const filter = (type) => {
        setMenuProducts(ProductsData.filter((product)=>product.type === type))
    }

    useEffect(() => {
        fetchAllProducts().then((products) => {
            // setMenuProducts(products);
            console.log(products);
        });
    }, []);

    const fetchAllProducts = async () => {
        try {
            return await ApiGateway.getAllProducts();
        } catch (error) {
            console.error("Failed to fetch products:", error);
        }
    };

    return (
        <div id='product'>
            <h1 className='title'>Our Featured Products</h1>

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
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Products