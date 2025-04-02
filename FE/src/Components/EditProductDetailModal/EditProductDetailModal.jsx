import React, { useState, useEffect } from 'react';
import '../EditProductModal/EditProductModal.css'; 

const EditProductDetailModal = ({ product, productDetail, onEdit, onDelete, onClose, allProductDetails = [] }) => {
  const initialFormState = {
    id: '',
    productId: '',
    size: '',
    stockQuantity: '',
    price: '',
    description: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (product && productDetail) {
      const initialData = {
        id: productDetail.id || '',
        productId: product.id || '',
        size: productDetail.size || '',
        stockQuantity: productDetail.stockQuantity || '',
        price: productDetail.price || '',
        description: productDetail.description || '',
      };
      
      setFormData(initialData);
      setIsDirty(false);
      setErrors({});
    }
  }, [product, productDetail]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs
    let processedValue = value;
    if (type === 'number') {
      // Convert to number if not empty, otherwise keep as empty string
      processedValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setIsDirty(true);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Size validation
    if (formData.size === '' || formData.size === null) {
      newErrors.size = 'Size is required';
    } else if (isNaN(formData.size) || formData.size <= 0) {
      newErrors.size = 'Size must be a positive number';
    } else if (formData.size > 10000) { // Set a reasonable maximum size
      newErrors.size = 'Size cannot exceed 10,000 ml';
    } else if (Math.floor(formData.size) !== formData.size) {
      newErrors.size = 'Size must be a whole number';
    }
    
    // Check for duplicate sizes
    const isDuplicate = allProductDetails.some(detail => 
      detail.productId === formData.productId && 
      detail.size === formData.size && 
      detail.id !== formData.id // exclude current item being edited
    );
    
    if (isDuplicate) {
      newErrors.size = 'A product variant with this size already exists';
    }
    
    // Price validation
    if (formData.price === '' || formData.price === null) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Price must be a positive number';
    } else if (formData.price > 100000000) { // Set a reasonable maximum price
      newErrors.price = 'Price cannot exceed 100,000,000 VNĐ';
    } else if (Math.floor(formData.price) !== formData.price) {
      newErrors.price = 'Price must be a whole number';
    }
    
    // Stock quantity validation
    if (formData.stockQuantity === '' || formData.stockQuantity === null) {
      newErrors.stockQuantity = 'Stock is required';
    } else if (isNaN(formData.stockQuantity) || formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock must be a non-negative number';
    } else if (formData.stockQuantity > 100000) { // Set a reasonable maximum stock
      newErrors.stockQuantity = 'Stock cannot exceed 100,000 units';
    } else if (Math.floor(formData.stockQuantity) !== formData.stockQuantity) {
      newErrors.stockQuantity = 'Stock must be a whole number';
    }
    
    // Description validation (optional)
    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert to appropriate types before submitting
      const submissionData = {
        ...formData,
        size: Number(formData.size),
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity)
      };
      
      onEdit(submissionData);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      // Optionally add a confirmation dialog here
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product detail?')) {
      onDelete(formData.id);
    }
  };

  return (
    <div id="edit_prod" className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Product Detail</h2>
          <button 
            type="button" 
            className="close-button" 
            onClick={handleCancel}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="productName">Product</label>
            <input
              type="text"
              id="productName"
              value={product?.name || ''}
              disabled
              className="disabled"
              aria-readonly="true"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="size">Size (ml)*</label>
            <input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              min="1"
              step="1"
              className={errors.size ? 'error' : ''}
              aria-invalid={errors.size ? 'true' : 'false'}
              aria-describedby={errors.size ? 'size-error' : undefined}
              required
            />
            {errors.size && (
              <span className="error-message" id="size-error">
                {errors.size}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price (VNĐ)*</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="1000"
              step="1000"
              className={errors.price ? 'error' : ''}
              aria-invalid={errors.price ? 'true' : 'false'}
              aria-describedby={errors.price ? 'price-error' : undefined}
              required
            />
            {errors.price && (
              <span className="error-message" id="price-error">
                {errors.price}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="stockQuantity">Stock*</label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              min="0"
              step="1"
              className={errors.stockQuantity ? 'error' : ''}
              aria-invalid={errors.stockQuantity ? 'true' : 'false'}
              aria-describedby={errors.stockQuantity ? 'stock-error' : undefined}
              required
            />
            {errors.stockQuantity && (
              <span className="error-message" id="stock-error">
                {errors.stockQuantity}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              maxLength="1000"
              className={errors.description ? 'error' : ''}
              aria-invalid={errors.description ? 'true' : 'false'}
              aria-describedby={errors.description ? 'desc-error' : undefined}
            ></textarea>
            {errors.description && (
              <span className="error-message" id="desc-error">
                {errors.description}
              </span>
            )}
            <div className="character-count">
              {formData.description?.length || 0}/1000
            </div>
          </div>
          
          <div className="form-actions">
            {onDelete && (
              <button 
                type="button" 
                className="delete-button" 
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
            <button 
              type="button" 
              className="cancel-button" 
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={Object.keys(errors).length > 0}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductDetailModal;