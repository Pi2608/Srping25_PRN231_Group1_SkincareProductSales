import React from 'react'
import './CartItem.css'

const CartItem = ({id, img, name, type, category, price, quantity}) => {
  return (
    <div id="cart_item">
        <input type="checkbox" name={name} id={id} />
        <img src={img} className="cart-item-image" />
        <div className="cart-item-details">
            <h2>{name}</h2>
            <p>{type} - {category}</p>
            <p className="cart-item-price">{new Intl.NumberFormat('vi-VN').format(price)} VND</p>
        </div>
        <div className="cart-item-quantity">
            <button onClick={() => updateQuantity(id, -1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => updateQuantity(id, 1)}>+</button>
        </div>
        <button className="cart-item-remove" onClick={() => removeItem(id)}>Remove</button>
    </div>
  )
}

export default CartItem