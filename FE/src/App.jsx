import { Routes, Route, useParams } from 'react-router-dom'
import './App.css'
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

function App() {

  const { productId } = useParams();
  
  return (
    <Routes>
				<Route path='/'>
          <Route index  element={<Home />}/>
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/cart' element={<Cart />} />
          <Route path='/vnpay-return' element={<VNPayReturn />}/>
          <Route path="/product/:productId" element={<ProductDetail key={productId} />} />
          <Route path='/profile'>
            <Route index element={<Profile/>} />
            <Route path='orders' element={<Order/>} />
            <Route path='vouchers' element={<Voucher/>} />
            <Route path='topup' element={<TopupPage />}/>
            <Route path='change-pwd' element={<ChangePwd/>} />
          </Route>
        </Route>

        <Route path='/dashboard'>
          <Route index element={<Dashboard/>}/>
          <Route path='mng-user' element={<UserMng/>}/>
          <Route path='mng-product' element={<ProductMng/>}/>
          <Route path='mng-order' element={<OrderMng/>}/>
          <Route path='mng-voucher' element={<VoucherMng/>}/>
        </Route>
    </Routes>
  )
}

export default App
