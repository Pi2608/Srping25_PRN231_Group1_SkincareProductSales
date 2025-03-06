import React, { useState } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import EditModal from '../../../Components/EditModal/EditModal'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import "./ProductMng.css";

const products = [
  { id: 1, name: "Givench Sweater", size: "Small", price: 1234000, stock: 231, rating: "Perfect", status: true },
  { id: 2, name: "Givench Sweater", size: "Small", price: 1234000, stock: 432, rating: "Very Good", status: true },
  { id: 3, name: "Givench Sweater", size: "Small", price: 1234000, stock: 432, rating: "Good", status: true },
  { id: 4, name: "Givench Sweater", size: "Small", price: 1234000, stock: 432, rating: "Good", status: false },
  { id: 5, name: "Givench Sweater", size: "Small", price: 1234000, stock: 432, rating: "Very Good", status: true },
  { id: 6, name: "Givench Sweater", size: "Small", price: 1234000, stock: 432, rating: "Bad", status: false },
  { id: 7, name: "Givench Sweater", size: "Small", price: 1234000, stock: 432, rating: "Perfect", status: false },
  { id: 8, name: "Givench Sweater", size: "Small", price: 1234000, stock: 432, rating: "Very Good", status: true },
  { id: 9, name: "Givench Sweater", size: "Small", price: 1234000, stock: 432, rating: "Good", status: true },
];

const ProductMng = () => {
  const [search, setSearch] = useState("");
  const [productList, setProductList] = useState(products);  
  const [openEditModal, setOpenEditModal] = useState(false);
  const [thisProduct, setThisProduct] = useState();

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const toggleStatus = (id) => {
    setProductList((prevList) =>
      prevList.map((product) =>
        product.id === id ? { ...product, status: !product.status } : product
      )
    );
  };

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditProduct = (product) => {

  }

  return (
    <DashboardLayoutComponent>
        <div id="product_mng">
          <div className="table-container">
            <div className="action-bar">
              <input
                  type="text"
                  placeholder="Search products"
                  value={search}
                  onChange={handleSearch}
                  className="search-bar"
              />
              <button className="search"><SearchIcon/>Search</button>
              <button className="add"><AddIcon/> Add Product</button>
            </div>
            <table className="product-table">
                <thead>
                <tr>
                    <th>No</th>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Price (VNĐ)</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {filteredProducts.map((product, index) => (
                    <tr key={product.id} onClick={() => {setOpenEditModal(true); setThisProduct(product)}}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="img-container">
                          {/* <img src="https://via.placeholder.com/150" alt="Product" /> */}
                        </div>
                      </td>
                      <td>{product.name}</td>
                      <td>{product.size}</td>
                      <td>{new Intl.NumberFormat('vi-VN').format(product.price)}</td>
                      <td>{product.stock}</td>
                      <td className={`rating ${product.rating.toLowerCase().replace(" ", "-")}`}>
                          {product.rating}
                      </td>
                      <td>
                          <label className="switch">
                          <input
                              type="checkbox"
                              checked={product.status}
                              onChange={() => toggleStatus(product.id)}
                          />
                          <span className="slider"></span>
                          </label>
                      </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
          {openEditModal && (
          <EditModal 
            type="Product"
            object={thisProduct}
            onEdit={handleEditProduct} 
            onClose={() => setOpenEditModal(false)} 
          />
        )}
        </div>
    </DashboardLayoutComponent>
  );
};

export default ProductMng;
