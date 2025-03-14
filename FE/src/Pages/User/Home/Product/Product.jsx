import React, { useState, useEffect } from 'react'
import ApiGateway from '../../../../Api/ApiGateway'
import CardProduct from '../../../../Components/CardProduct/CardProduct'
import './Product.css'

const Products = () => {
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

    const filter = (type) => {
        setMenuProducts(MenuProducts.filter((product)=>product.type === type))
    }

    return (
        <div id='product'>
            <h1 className='title'>Our Featured Products</h1>

            <div className='product-container'>
                <ul className='type'>
                    <li onClick={() => setMenuProducts(MenuProducts)} className='menu'>All</li>
                    <li onClick={() => filter("skin care")} className='menu'>Skin Care</li>
                    <li onClick={() => filter("conditioner")} className='menu'>Conditioners</li>
                    <li onClick={() => filter("foundation")} className='menu'>Foundations</li>
                </ul>


                <div className='items'>
                    {MenuProducts?.map((product, i) => (
                        <CardProduct product={product}/>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Products