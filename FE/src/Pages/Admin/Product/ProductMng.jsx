import React, { useState, useEffect } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import AddProductModal from '../../../Components/AddProductModal/AddProductModal';
import EditProductModal from "../../../Components/EditProductModal/EditProductModal";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ApiGateway from "../../../Api/ApiGateway";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductMng.css";

const ProductMng = () => {
  const [search, setSearch] = useState("");
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [thisProduct, setThisProduct] = useState(null);

  useEffect(() => {
    fetchProducts().then((products) => setProductList(products));
    console.log(thisProduct);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const products = await ApiGateway.getAllProducts();
      const productsWithDetails = await Promise.all(
        products.map(async (product) => {
            const details = await ApiGateway.getProductDetailByProductId(product.id);
            return { ...product, details };
        })
      );  
      setError(null);
      const firstProduct = productsWithDetails[0];
      setThisProduct(firstProduct);

      return productsWithDetails;
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  const handleSearch = async () => {
    try {
      const data = await ApiGateway.searchProducts(search);
      const productsWithDetails = await Promise.all(
        data.map(async (product) => {
            const details = await ApiGateway.getProductDetailByProductId(product.id);
            return { ...product, details };
        })
      );  
      setError(null);
      setProductList(productsWithDetails);
      console.log(data)
    } catch (error) {
        console.error("Error fetching products:", error);
    }
  }
  const toggleStatus = async (id, currentStatus) => {
    try {
      event.stopPropagation();
      
      setProductList((prevList) =>
        prevList.map((product) =>
          product.id === id ? { ...product, status: !product.status } : product
        )
      );
      
      await ApiGateway.updateProductStatus(id, !currentStatus);
      toast.success("Product status updated successfully!");
    } catch (err) {
      setProductList((prevList) =>
        prevList.map((product) =>
          product.id === id ? { ...product, status: currentStatus } : product
        )
      );
      toast.error("Failed to update product status.");
      console.error("Error updating product status:", err);
    }
  };

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase()
  );

  const handleEditProduct = async (updatedProduct, productDetails = null) => {
    try {
      // First update the base product
      await ApiGateway.updateProduct(updatedProduct.id, updatedProduct);
      
      // If product details are provided, update them as well
      if (productDetails) {
        if (productDetails.id) {
          await ApiGateway.updateProductDetail(productDetails.id, productDetails);
        } else {
          // If there's no product detail ID but we need to create one
          productDetails.productId = updatedProduct.id;
          await ApiGateway.createProductDetail(productDetails);
        }
      }
      
      // Update local state
      setProductList((prevList) =>
        prevList.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      
      setOpenEditModal(false);
      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error("Failed to update product.");
      console.error("Error updating product:", err);
    }
  };

  const handleAddProduct = async (newProduct, productDetails = null) => {
    try {
      // Step 1: Create the base product first
      const createdProduct = await ApiGateway.createProduct(newProduct);
      
      // Step 2: If there are product details, create them with the new product ID
      if (productDetails) {
        productDetails.productId = createdProduct.id;
        await ApiGateway.createProductDetail(productDetails);
      }
      
      // Update local state
      setProductList((prevList) => [...prevList, createdProduct]);
      
      setOpenAddModal(false);
      toast.success("Product added successfully!");
    } catch (err) {
      toast.error("Failed to add product.");
      console.error("Error adding product:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this product?")) {
        // Step 1: Check if there are any product details associated with this product
        try {
          const productDetails = await ApiGateway.getProductDetailByProductId(id);
          
          // Step 2: If there are product details, delete them first
          if (productDetails && productDetails.id) {
            await ApiGateway.deleteProductDetail(productDetails.id);
          }
        } catch (detailsErr) {
          console.error("Error fetching product details during deletion:", detailsErr);
          // Continue with product deletion even if no details found
        }
        
        // Step 3: Delete the product
        await ApiGateway.deleteProduct(id);
        
        // Update local state
        // setProductList((prevList) => prevList.filter(product => product.id !== id));
        
        setOpenEditModal(false);
        toast.success("Product deleted successfully!");
      }
    } catch (err) {
      toast.error("Failed to delete product.");
      console.error("Error deleting product:", err);
    }
  };

  const handleViewProductDetails = async (productId) => {
    try {
      const productDetails = await ApiGateway.getProductDetailByProductId(productId);
      return productDetails;
    } catch (err) {
      console.error("Error fetching product details:", err);
      toast.error("Failed to fetch product details.");
      return null;
    }
  };

  return (
    <DashboardLayoutComponent>
      <div id="product_mng">
        <ToastContainer autoClose={3000} />
        <div className="table-container">
          <div className="action-bar">
            <input
              type="text"
              placeholder="Search products"
              value={search}
              onChange={(e) => handleSearchChange(e)}
              className="search-bar"
            />
            <button className="search" onClick={() => handleSearch()}><SearchIcon />Search</button>
            <button className="add" onClick={() => setOpenAddModal(true)}>
              <AddIcon /> Add Product
            </button>
          </div>
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Size (ml)</th>
                  <th>Price (VNĐ)</th>
                  <th>Stock</th>
                  {/* <th>Status</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-products">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product, index) => (
                    <tr key={product.id} onClick={async () => {
                      const details = await handleViewProductDetails(product.id);
                      setThisProduct({...product, details});
                      setOpenEditModal(true);
                      console.log('Product details:', thisProduct);
                    }}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="img-container">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : ( 
                            <div className="no-image">No Image</div>
                          )}
                        </div>
                      </td>
                      <td>{product.name}</td>
                      <td>{product?.details.size || '-'}</td>
                      <td>{new Intl.NumberFormat('vi-VN').format(product?.details.price * 1000)}</td>
                      <td>{product?.details.stockQuantity}</td>
                      {/* <td onClick={(e) => e.stopPropagation()}>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={product.isDelete}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleStatus(product.id, product.status);
                            }}
                          />
                          <span className="slider"></span>
                        </label>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {openEditModal && thisProduct &&(
          <EditProductModal
            open={openEditModal}
            type="Product"
            object={thisProduct}
            onEdit={(updatedProduct) => {
              const { details, ...baseProduct } = updatedProduct;
              handleEditProduct(baseProduct, details);
            }}
            onDelete={() => handleDeleteProduct(thisProduct.id)}
            onClose={() => setOpenEditModal(false)}
          />
        )} 
        
        {openAddModal && (
          <AddProductModal
            onAdd={(newProduct) => {
              const { details, ...baseProduct } = newProduct;
              handleAddProduct(baseProduct, details);
            }}
            onClose={() => setOpenAddModal(false)}
          />
        )}
      </div>
    </DashboardLayoutComponent>
  );
};

export default ProductMng;