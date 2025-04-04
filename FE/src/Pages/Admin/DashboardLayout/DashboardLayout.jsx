import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../AuthContext/AuthContext";
import './DashBoardLayout.css'

const DashboardLayoutComponent = ({children}) => {

  const navigate = useNavigate();

  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Skin Haven Dashboard</h2>
        <ul>
          {/* <li className={isActive('/dashboard')} onClick={() => navigate('/dashboard')}>Dashboard</li> */}
          <li className={isActive('/dashboard/mng-user')} onClick={() => navigate('/dashboard/mng-user')}>Users</li>
          <li className={isActive('/dashboard/mng-product')} onClick={() => navigate('/dashboard/mng-product')}>Products</li>
          <li className={isActive('/dashboard/mng-voucher')} onClick={() => navigate('/dashboard/mng-voucher')}>Voucher</li>
          <li className={isActive('/dashboard/mng-order')} onClick={() => navigate('/dashboard/mng-order')}>Orders</li>
          <li onClick={() => logout()}>Log Out</li>
        </ul>
      </aside>
      <main className="main-content">
        <header className="top-nav">
            <h1>Dashboard Overview</h1>
        </header>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayoutComponent;