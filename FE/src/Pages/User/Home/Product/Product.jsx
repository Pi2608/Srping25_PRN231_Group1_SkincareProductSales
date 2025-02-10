import React from 'react'
import { useState } from 'react'
import { ProductsData } from '../../../../data/products'
import './Product.css'

const Products = () => {
    const [MenuProducts, setMenuProducts] = useState(ProductsData)

    const filter = (type) => {
        setMenuProducts(ProductsData.filter((product)=>product.type === type))
    }

  return (
    <div id='product'>
        <h1 className='tittle'>Our Featured Products</h1>

        <div className='product-container'>
            <ul className='type'>
                <li onClick={() => setMenuProducts(ProductsData)} className='menu'>All</li>
                <li onClick={() => filter("skin care")} className='menu'>Skin Care</li>
                <li onClick={() => filter("conditioner")} className='menu'>Conditioners</li>
                <li onClick={() => filter("foundation")} className='menu'>Foundations</li>
            </ul>


            <div className='items'>
                {MenuProducts.map((product, i) => (
                        <div className='item'>
                            <div>
                                <div className='product-info'>
                                    <span className='name'>{product.name} <br></br></span>
                                    <span className='details'>{product.detail}</span>
                                </div>
                                <span className='price'>{product.price}$</span>
                                <div className='buy-btn'>Buy Now</div>
                            </div>

                            <div className="img-container">
                                <img 
                                    src={product.img} 
                                    alt=""
                                    />
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

    </div>
  )
}

export default Products