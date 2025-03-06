import React from 'react'
import './CardProduct.css'

const CardProduct = ({product}) => {
  return (
    <div id='card_product' onClick={() => navigate(`/product/${product.id}`)}>
        <div className="img-container">
            <img 
                src={product.img} 
                alt=""
                />
        </div>

        <div className='info-container'>
            <div className='product-info'>
                <span className='name'>{product.name} <br></br></span>
                <span className='details'>{product.detail}</span>
            </div>
            <span className='price'>{new Intl.NumberFormat('vi-VN').format(product.price)}VND</span>
            <div className='buy-btn' onClick={(e) => {
                e.stopPropagation(); 
                user ? {} : handleLoginRedirect();
            }}>Buy Now</div>
        </div>
    </div>
  )
}

export default CardProduct