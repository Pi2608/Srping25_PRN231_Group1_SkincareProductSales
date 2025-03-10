import React from 'react';
import './CartItem.css';

const CartItem = ({ id, img, name, type, category, price, quantity, updateQuantity, removeItem, toggleSelectItem, isSelected }) => {
  return (
    <div id="cart_item">
        <input type="checkbox" checked={isSelected} onChange={() => toggleSelectItem(id)} />
        <img src={img} className="cart-item-image" alt={name} />
        <div className="cart-item-details">
            <h2>{name}</h2>
            <p>{type} - {category}</p>
            <p className="cart-item-price">Price: {new Intl.NumberFormat('vi-VN').format(price)} VND</p>
        </div>
        <div className="cart-item-quantity">
            <button onClick={() => updateQuantity(id, -1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => updateQuantity(id, 1)}>+</button>
        </div>
        <div className="cart-item-total">
            <p>Total: <strong>{new Intl.NumberFormat('vi-VN').format(price * quantity)} VND</strong></p>
        </div>
        <button className="cart-item-remove" onClick={() => removeItem(id, name)}>Remove</button>
    </div>
  );
};

export default CartItem;
