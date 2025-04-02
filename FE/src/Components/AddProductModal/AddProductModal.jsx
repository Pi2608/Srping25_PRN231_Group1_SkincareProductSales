import React, { useState, useEffect } from 'react';
import './AddProductModal.css';
import CloseIcon from '@mui/icons-material/Close';
import ApiGateway from '../../Api/ApiGateway';

const AddProductModal = ({ onAdd, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  
  const [productData, setProductData] = useState({
    name: '',
    shortDescription: '',
    image: '',
    categories: []
  });
  
  const [productDetails, setProductDetails] = useState({
    description: '',
    price: '',
    stockQuantity: '', // Changed from 'stock' to match API expectations
    size: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ApiGateway.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setProductData({ ...productData, [name]: checked });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const categoryId = value;
    
    if (checked) {
      // Find the full category object for the selected ID
      const selectedCategory = categories.find(cat => cat.id === categoryId);
      
      setProductData({
        ...productData,
        categories: [...productData.categories, selectedCategory]
      });
    } else {
      setProductData({
        ...productData,
        categories: productData.categories.filter(cat => cat.id !== categoryId)
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Store the actual file object for later upload
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProductData({
          ...productData,
          image: reader.result 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onAdd(productData, imageFile);
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="add-product-modal">
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button className="close-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-sections">
            <div className="product-basic-info">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={productData.name}
                  onChange={handleProductChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="shortDescription">Short Description *</label>
                <input
                  type="text"
                  id="shortDescription"
                  name="shortDescription"
                  value={productData.shortDescription}
                  onChange={handleProductChange}
                  required
                />
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
                {productData.image && (
                  <div className="image-preview">
                    <img src={productData.image} alt="Product preview" />
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label>Categories</label>
                <div className="categories-list">
                  {categories.map(category => (
                    <div key={category.id} className="category-item">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        value={category.id}
                        checked={productData.categories.some(cat => cat.id === category.id)}
                        onChange={handleCategoryChange}
                      />
                      <label htmlFor={`category-${category.id}`}>{category.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;