import React, { useState } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import "./ProductMng.css";

const products = [
  { id: 1, name: "Givench Sweater", buyers: 12990, price: 1234.82, stock: 231, rating: "Perfect", status: true },
  { id: 2, name: "Givench Sweater", buyers: 12990, price: 1234.82, stock: 432, rating: "Very Good", status: true },
  { id: 3, name: "Givench Sweater", buyers: 12990, price: 1234.82, stock: 432, rating: "Good", status: true },
  { id: 4, name: "Givench Sweater", buyers: 12990, price: 1234.82, stock: 432, rating: "Good", status: false },
  { id: 5, name: "Givench Sweater", buyers: 12990, price: 1234.82, stock: 432, rating: "Very Good", status: true },
  { id: 6, name: "Givench Sweater", buyers: 12990, price: 1234.82, stock: 432, rating: "Bad", status: false },
  { id: 7, name: "Givench Sweater", buyers: 12990, price: 1234.82, stock: 432, rating: "Perfect", status: false },
  { id: 8, name: "Givench Sweater", buyers: 12990, price: 1234.82, stock: 432, rating: "Very Good", status: true },
  { id: 9, name: "Givench Sweater", buyers: 12990, price: 1234.82, stock: 432, rating: "Good", status: true },
];

const ProductMng = () => {
  const [search, setSearch] = useState("");
  const [productList, setProductList] = useState(products);

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

  return (
    <DashboardLayoutComponent>
        <div id="product_mng">
          <div className="table-container">
            <input
                type="text"
                placeholder="Search products"
                value={search}
                onChange={handleSearch}
                className="search-bar"
            />
            <table className="product-table">
                <thead>
                <tr>
                    <th>Rank</th>
                    <th>Product</th>
                    <th>Total Buyers</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {filteredProducts.map((product, index) => (
                    <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.buyers}</td>
                    <td>${product.price.toFixed(2)}</td>
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
        </div>
    </DashboardLayoutComponent>
  );
};

export default ProductMng;
