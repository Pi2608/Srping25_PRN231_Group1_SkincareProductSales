import React, { useState, useEffect } from 'react';
import './EditProductModal.css';

const EditModal = ({ type, object, onEdit, onDelete, onClose }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (object) {
      const initialData = {
        id: object.id,
        name: object.name,
        image: object.image,
        shortDescription: object.shortDescription,
        categories: object.categories || [],
        size: object.details?.size || '',
        stock: object.details?.stockQuantity || 0,
        price: object.details?.price || 0,
        rating: object.details?.rating || '',
        description: object.details?.description || '',
      };
      
      setFormData(initialData);
    }
  }, [object]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (type === 'Product') {
      if (!formData.name?.trim()) newErrors.name = 'Product name is required';
      if (!formData.size?.toString().trim()) newErrors.size = 'Size is required';
      
      if (!formData.price) {
        newErrors.price = 'Price is required';
      } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
      
      if (!formData.stock) {
        newErrors.stock = 'Stock is required';
      } else if (isNaN(formData.stock) || Number(formData.stock) < 0) {
        newErrors.stock = 'Stock must be a non-negative number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const formattedData = {
        id: formData.id,
        name: formData.name,
        image: formData.image,
        shortDescription: formData.shortDescription,
        categories: formData.categories,
        details: {
          productId: formData.id,
          size: formData.size,
          stockQuantity: Number(formData.stock),
          price: Number(formData.price),
          rating: formData.rating,
          description: formData.description,
        }
      };
      
      onEdit(formattedData);
    }
  };
  const renderForm = () => {
    if (type === 'Product') {
      return (
        <>
          <div className="form-group">
            <label htmlFor="name">Product Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="shortDescription">Short Description</label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="size">Size (ml)*</label>
            <input
              type="text"
              id="size"
              name="size"
              value={formData.size || ''}
              onChange={handleChange}
              className={errors.size ? 'error' : ''}
            />
            {errors.size && <span className="error-message">{errors.size}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price (VNĐ)*</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              min="0"
              step="1000"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="stock">Stock*</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock || ''}
              onChange={handleChange}
              min="0"
              className={errors.stock ? 'error' : ''}
            />
            {errors.stock && <span className="error-message">{errors.stock}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              name="rating"
              value={formData.rating || ''}
              onChange={handleChange}
            >
              <option value="">Select Rating</option>
              <option value="5 Stars">5 Stars</option>
              <option value="4 Stars">4 Stars</option>
              <option value="3 Stars">3 Stars</option>
              <option value="2 Stars">2 Stars</option>
              <option value="1 Star">1 Star</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image || ''}
              onChange={handleChange}
              placeholder="https://..."
            />
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Product preview" />
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
        </>
      );
    }
    
    return <p>Unknown type: {type}</p>;
  };

  return (
    <div id='edit_prod' className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit {type}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {renderForm()}
          
          <div className="form-actions">
            {onDelete && (
              <button 
                type="button" 
                className="delete-button" 
                onClick={() => onDelete(formData.id)}
              >
                Delete
              </button>
            )}
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-button">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;