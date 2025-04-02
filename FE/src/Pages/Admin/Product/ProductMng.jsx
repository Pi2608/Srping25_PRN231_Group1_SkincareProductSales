import React, { useState, useEffect } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import AddProductModal from '../../../Components/AddProductModal/AddProductModal';
import EditProductModal from "../../../Components/EditProductModal/EditProductModal";
import EditProductDetailModal from "../../../Components/EditProductDetailModal/EditProductDetailModal";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ApiGateway from "../../../Api/ApiGateway";
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Collapse, 
  IconButton, 
  Typography, 
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductMng.css";

function Row(props) {
  const { product, onEditProduct, onEditProductDetail, onDeleteProduct, onDeleteProductDetail } = props;
  const [open, setOpen] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case true:
        return 'red';
      case false:
        return '#46FF40';
      default:
        return 'black';
    }
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell align="center">
          {product.image ? (
            <div className="img-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <img src={product.image} alt={product.name} />
            </div>
          ) : ( 
            <div className="no-image">No Image</div>
          )}
        </TableCell>
        <TableCell>{product.name}</TableCell>
        <TableCell>{product.shortDescription}</TableCell>
        <TableCell>
          {product.categories.map((category, i) => (
            <div key={i} style={{display: "flex", flexDirection: "column", gap: "2px"}}>{category.name}</div>
          ))}
        </TableCell>
        <TableCell>
          <p style={{color:`${getStatusColor(product.isDeleted)}`}}>{product.isDeleted ? 'Unavailable' : 'Available'}</p> 
        </TableCell>
        <TableCell>
          <div style={{display: 'flex', gap: '5px'}}>
            <Button variant="outlined" onClick={() => onEditProduct(product)}>Edit</Button>
            <Button variant="outlined" color="error" onClick={() => onDeleteProduct(product.id)}>Delete</Button>
          </div>
        </TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Product Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Size</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="right">Price(VND)</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {product?.details.map((detail, i) => (
                    <TableRow key={detail.id || i}>
                      <TableCell>{detail.size}</TableCell>
                      <TableCell align="center">{detail.stockQuantity}</TableCell>
                      <TableCell align="left">{detail.description}</TableCell>
                      <TableCell align="right">{new Intl.NumberFormat('vi-VN').format(detail.price * 1000)}</TableCell>
                      <TableCell>
                        <Box sx={{display: 'flex', gap: '5px'}}>
                          <Button variant="outlined" onClick={() => onEditProductDetail(product, detail)}>Edit</Button>
                          <Button variant="outlined" color="error" onClick={() => onDeleteProductDetail(detail.id)}>Delete</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const ProductMng = () => {
  const [search, setSearch] = useState("");
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [openEditProductModal, setOpenEditProductModal] = useState(false);
  const [openEditProductDetailModal, setOpenEditProductDetailModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const products = await ApiGateway.getAllProducts();
      const productsWithDetails = await Promise.all(
        products.map(async (product) => {
            if (product.details) {
              
            }
            const details = await ApiGateway.getProductDetailByProductId(product.id);
            return { ...product, details: Array.isArray(details) ? details : [details].filter(d => d) };
        })
      );  
      setProductList(productsWithDetails);
      setError(null);
      return productsWithDetails;
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching products:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  const handleSearch = async () => {
    if (!search.trim()) {
      fetchProducts();
      return;
    }
    
    try {
      setLoading(true);
      const data = await ApiGateway.searchProducts(search);
      const productsWithDetails = await Promise.all(
        data.map(async (product) => {
            const details = await ApiGateway.getProductDetailByProductId(product.id);
            return { ...product, details: Array.isArray(details) ? details : [details].filter(d => d) };
        })
      );  
      setProductList(productsWithDetails);
      setError(null);
    } catch (error) {
      console.error("Error searching products:", error);
      setError("Failed to search products. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setOpenEditProductModal(true);
  };

  const handleEditProductDetail = (product, detail) => {
    setSelectedProduct(product);
    setSelectedProductDetail(detail);
    setOpenEditProductDetailModal(true);
  };

  const handleUpdateProduct = async (updatedProduct, imageFile) => {
    try {
      // Create a copy of the updated product to format for the API
      const formattedProduct = {
        id: updatedProduct.id, // Make sure we include the ID
        name: updatedProduct.name,
        shortDescription: updatedProduct.shortDescription,
        // Extract category IDs correctly
        productCategory: updatedProduct.categories.map(category => 
          // Handle if categories is already an array of IDs or an array of objects with id property
          typeof category === 'object' ? category.id : category
        )
      };
      
      // Update the product with the API
      await ApiGateway.updateProduct(formattedProduct, imageFile);
      await fetchProducts();
      
      setOpenEditProductModal(false);
      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error("Failed to update product.");
      console.error("Error updating product:", err);
    }
  };

  const handleUpdateProductDetail = async (updatedDetail) => {
    try {
      // Format the data as required by the API
      const formattedDetail = {
        productId: updatedDetail.productId,
        size: updatedDetail.size,
        stockQuantity: updatedDetail.stockQuantity,
        description: updatedDetail.description,
        price: updatedDetail.price
      };
      
      await ApiGateway.updateProductDetail(updatedDetail.id, formattedDetail);
      
      // Update local state
      setProductList(prevList =>
        prevList.map(product => 
          product.id === updatedDetail.productId
            ? {
                ...product,
                details: product.details.map(detail => 
                  detail.id === updatedDetail.id ? updatedDetail : detail
                )
              }
            : product
        )
      );
      
      setOpenEditProductDetailModal(false);
      toast.success("Product detail updated successfully!");
    } catch (err) {
      toast.error("Failed to update product detail.");
      console.error("Error updating product detail:", err);
    }
  };

  const handleAddProduct = async (newProduct, imageFile) => {
    try {
      // Split the product and product detail data
      const { details, ...baseProduct } = newProduct;
      
      // Format the product data as required by the API
      const formattedProduct = {
        name: baseProduct.name,
        shortDescription: baseProduct.shortDescription,
        productCategory: baseProduct.categories ? baseProduct.categories.map(category => category.id) : []
      };
      
      // Upload image to Firebase if provided
      if (imageFile) {
        const imageUrl = await ApiGateway.uploadImageToFirebase(imageFile);
        formattedProduct.image = imageUrl;
      }
      
      // Step 1: Create the base product with the image URL
      const createdProduct = await ApiGateway.createProduct(formattedProduct);
      
      // Step 2: If there are product details, create them with the new product ID
      let updatedProduct = { 
        ...createdProduct, 
        details: [],
        image: formattedProduct.image // Make sure the image URL is included
      };
      
      if (details) {
        const formattedDetail = {
          productId: createdProduct.id,
          size: details.size,
          stockQuantity: details.stockQuantity,
          description: details.description,
          price: details.price
        };
        
        const createdDetail = await ApiGateway.createProductDetail(formattedDetail);
        updatedProduct.details = [createdDetail];
      }
      
      // Update local state
      setProductList(prevList => [...prevList, updatedProduct]);
      
      setOpenAddModal(false);
      toast.success("Product added successfully!");
    } catch (err) {
      toast.error("Failed to add product.");
      console.error("Error adding product:", err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      if (window.confirm("Are you sure you want to delete this product?")) {
        await ApiGateway.deleteProduct(productId);
        
        // Update local state
        await fetchProducts();
        
        toast.success("Product deleted successfully!");
      }
    } catch (err) {
      toast.error("Failed to delete product.");
      console.error("Error deleting product:", err);
    }
  };

  const handleDeleteProductDetail = async (detailId) => {
    try {
      if (window.confirm("Are you sure you want to delete this product detail?")) {
        await ApiGateway.deleteProductDetail(detailId);
        
        // Update local state
        setProductList(prevList =>
          prevList.map(product => ({
            ...product,
            details: product.details.filter(detail => detail.id !== detailId)
          }))
        );
        
        toast.success("Product detail deleted successfully!");
      }
    } catch (err) {
      toast.error("Failed to delete product detail.");
      console.error("Error deleting product detail:", err);
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
              onChange={handleSearchChange}
              className="search-bar"
            />
            <button className="search" onClick={handleSearch}><SearchIcon />Search</button>
            <button className="add" onClick={() => setOpenAddModal(true)}>
              <AddIcon /> Add Product
            </button>
          </div>
          <TableContainer>
          {loading ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loading...</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Image</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Short Description</TableCell>
                    <TableCell>Categories</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productList.length > 0 ? (
                    productList.map((product) => (
                      <Row 
                        key={product.id} 
                        product={product}
                        onEditProduct={handleEditProduct}
                        onEditProductDetail={handleEditProductDetail}
                        onDeleteProduct={handleDeleteProduct}
                        onDeleteProductDetail={handleDeleteProductDetail}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        {loading ? "Loading products..." : "No products found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </div>
        
        {openEditProductModal && selectedProduct && (
          <EditProductModal
            open={openEditProductModal}
            product={selectedProduct}
            onEdit={handleUpdateProduct}
            onDelete={() => handleDeleteProduct(selectedProduct.id)}
            onClose={() => setOpenEditProductModal(false)}
          />
        )} 
        
        {openEditProductDetailModal && selectedProduct && selectedProductDetail && (
          <EditProductDetailModal
            open={openEditProductDetailModal}
            product={selectedProduct}
            productDetail={selectedProductDetail}
            onEdit={handleUpdateProductDetail}
            onDelete={() => handleDeleteProductDetail(selectedProductDetail.id)}
            onClose={() => setOpenEditProductDetailModal(false)}
          />
        )}
        
        {openAddModal && (
          <AddProductModal
            onAdd={handleAddProduct}
            onClose={() => setOpenAddModal(false)}
          />
        )}
      </div>
    </DashboardLayoutComponent>
  );
};

export default ProductMng;