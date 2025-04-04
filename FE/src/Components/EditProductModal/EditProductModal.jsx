import React, { useState, useEffect } from 'react';
import ApiGateway from '../../Api/ApiGateway';
import './EditProductModal.css';

const EditProductModal = ({ product, onEdit, onClose }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [allCategories, setAllCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    // Initialize form data from product prop
    if (product) {
      const initialData = {
        id: product.id,
        name: product.name || '',
        image: product.image || '',
        shortDescription: product.shortDescription || '',
        categories: product.categories || [],
      };
      
      setFormData(initialData);
    }
    
    // Fetch all categories from API
    fetchCategories();
  }, [product]);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setCategoryError(null);
    
    try {
      // Replace with your actual API endpoint
      const response = await ApiGateway.getAllCategories();
      
      setAllCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategoryError('Failed to load categories. Please try again.');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Check if a category is selected
  const isCategorySelected = (categoryId) => {
    if (!formData?.categories) {
      return false;
    }
    
    // Handle both scenarios: categories as array of objects or array of IDs
    if (formData.categories.length > 0 && typeof formData.categories[0] === 'object') {
      // If categories is an array of objects with id property
      return formData.categories.some(category => category.id === categoryId);
    } else {
      // If categories is already an array of IDs
      return formData.categories.includes(categoryId);
    }
  };

  // Update handleCategoryChange to handle both object arrays and ID arrays
  const handleCategoryChange = (categoryId) => {
    let updatedCategories = [...(formData.categories || [])];
    
    // Determine if we're working with an array of category objects or just IDs
    const isObjectArray = updatedCategories.length > 0 && typeof updatedCategories[0] === 'object';
    
    if (isObjectArray) {
      // Working with an array of category objects
      const existingIndex = updatedCategories.findIndex(cat => cat.id === categoryId);
      
      if (existingIndex >= 0) {
        // Remove category if already selected
        updatedCategories.splice(existingIndex, 1);
      } else {
        // Get the category object from allCategories
        const categoryToAdd = allCategories.find(cat => cat.id === categoryId);
        if (categoryToAdd) {
          updatedCategories.push(categoryToAdd);
        }
      }
    } else {
      // Working with an array of category IDs
      if (updatedCategories.includes(categoryId)) {
        // Remove category if already selected
        const index = updatedCategories.indexOf(categoryId);
        updatedCategories.splice(index, 1);
      } else {
        // Add category if not selected
        updatedCategories.push(categoryId);
      }
    }
    
    setFormData({
      ...formData,
      categories: updatedCategories
    });
    
    // Clear category error if any categories are selected
    if (updatedCategories.length > 0 && errors.categories) {
      setErrors({
        ...errors,
        categories: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validation
    if (!formData.name?.trim()) newErrors.name = 'Product name is required';
    if (!formData.shortDescription?.trim()) newErrors.shortDescription = 'Short description is required';
    
    // Only validate image URL if no new file is selected and we're using the existing URL
    if (!imageFile && !formData.image?.trim()) {
      newErrors.image = 'Image is required';
    }
    
    // URL validation for image field only if it's a URL and not a file
    if (!imageFile && formData.image?.trim() && !isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }
    
    // Categories validation (must select at least one)
    if (!formData.categories || formData.categories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); 
      
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
          ...formData,
          image: reader.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Helper function to validate URLs
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onEdit(formData, imageFile);
    }
  };
  
  return (
    <div id='edit_prod' className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="shortDescription">Short Description*</label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription || ''}
              onChange={handleChange}
              className={errors.shortDescription ? 'error' : ''}
            />
            {errors.shortDescription && <span className="error-message">{errors.shortDescription}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {formData.image && (
              <div className="image-preview">
                <img src={formData.image} alt="Product preview" />
              </div>
            )}
            {errors.image && <span className="error-message">{errors.image}</span>}
          </div>
          
          <div className="form-group">
            <label>Categories*</label>
            {isLoadingCategories ? (
              <div className="loading-categories">Loading categories...</div>
            ) : categoryError ? (
              <div className="category-error">
                {categoryError}
                <button 
                  type="button" 
                  className="retry-button" 
                  onClick={fetchCategories}
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className={`categories-container ${errors.categories ? 'error' : ''}`}>
                {allCategories.map(category => (
                  <div key={category.id} className="category-checkbox" style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={isCategorySelected(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    <label htmlFor={`category-${category.id}`} style={{margin: 0}}>{category.name}</label>
                  </div>
                ))}
                {allCategories.length === 0 && (
                  <div className="no-categories">No categories available</div>
                )}
              </div>
            )}
            {errors.categories && <span className="error-message">{errors.categories}</span>}
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="save-button">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;