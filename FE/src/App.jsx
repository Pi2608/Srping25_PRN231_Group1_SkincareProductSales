import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext/AuthContext.jsx'
import './App.css'

// Import all your existing components
import Home from './Pages/User/Home/Home.jsx'
import ProductsPage from './Pages/User/ProductsPage/ProductsPage.jsx'
import Login from './Components/Login/Login.jsx'
import Register from './Components/Register/Register.jsx'
import Cart from './Pages/User/Cart/Cart.jsx'
import ProductDetail from './Pages/User/ProductDetail/ProductDetail.jsx'
import Profile from './Pages/User/Profile/Profile/Profile.jsx'
import Order from './Pages/User/Profile/Order/Order.jsx'
import VNPayReturn from './Pages/User/VNPayReturn/VNPayReturn .jsx'
import TopupPage from './Pages/User/Profile/TopupPage/TopupPage.jsx'
import ChangePwd from './Pages/User/Profile/ChangePwd/ChangePwd.jsx'
import Voucher from './Pages/User/Profile/Voucher/Voucher.jsx'
import Dashboard from './Pages/Admin/Dashboard/Dashboard.jsx'
import ProductMng from './Pages/Admin/Product/ProductMng.jsx'
import UserMng from './Pages/Admin/User/UserMng.jsx'
import OrderMng from './Pages/Admin/Order/OrderMng.jsx'
import VoucherMng from './Pages/Admin/Voucher/VoucherMng.jsx'
import NoPermission from './Pages/NoPermission/NoPermission.jsx'

// ProtectedRoute component to handle role-based access
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  // Show loading indicator while authentication check is in progress
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/no-permission" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path='/'>
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/no-permission" element={<NoPermission />} />
        <Route path='/products' element={<ProductsPage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />

        <Route path='/cart' element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path='/vnpay-return' element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <VNPayReturn />
          </ProtectedRoute>
        } />
        
        <Route path='/profile'>
          <Route index element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path='orders' element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <Order />
            </ProtectedRoute>
          } />
          <Route path='vouchers' element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <Voucher />
            </ProtectedRoute>
          } />
          <Route path='topup' element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <TopupPage />
            </ProtectedRoute>
          } />
          <Route path='change-pwd' element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <ChangePwd />
            </ProtectedRoute>
          } />
        </Route>
      </Route>

      {/* Admin Protected Routes */}
      <Route path='/dashboard'>
        {/* <Route index element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <Dashboard />
          </ProtectedRoute>
        } /> */}
        <Route path='mng-user' element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <UserMng />
          </ProtectedRoute>
        } />
        <Route path='mng-product' element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <ProductMng />
          </ProtectedRoute>
        } />
        <Route path='mng-order' element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <OrderMng />
          </ProtectedRoute>
        } />
        <Route path='mng-voucher' element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <VoucherMng />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App