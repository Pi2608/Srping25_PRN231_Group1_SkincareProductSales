import React, { useState } from "react";
import DashboardLayoutComponent from "../DashBoardLayout/DashboardLayout";
import "./OrderMng.css";

const orders = [
  { id: 1, totalPrice: 250.5, status: "Pending", createdAt: "2024-02-20" },
  { id: 2, totalPrice: 120.0, status: "Completed", createdAt: "2024-02-18" },
  { id: 3, totalPrice: 310.75, status: "Shipped", createdAt: "2024-02-19" },
  { id: 4, totalPrice: 500.0, status: "Canceled", createdAt: "2024-02-17" },
];

const OrderMng = () => {
  const [search, setSearch] = useState("");
  const [orderList, setOrderList] = useState(orders);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredOrders = orderList.filter((order) =>
    order.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayoutComponent>
        <div id="order_mng">
            <div className="table-container">
                <input
                    type="text"
                    placeholder="Search orders by status"
                    value={search}
                    onChange={handleSearch}
                    className="search-bar"
                />
                <table className="product-table">
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Created At</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredOrders.map((order) => (
                        <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>${order.totalPrice.toFixed(2)}</td>
                        <td>{order.status}</td>
                        <td>{order.createdAt}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    </DashboardLayoutComponent>
  );
};

export default OrderMng;
