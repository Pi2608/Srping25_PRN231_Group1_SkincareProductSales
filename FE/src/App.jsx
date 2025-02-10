import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Pages/User/Home/Home.jsx'
import ProductsPage from './Pages/User/ProductsPage/ProductsPage.jsx'

function App() {
  return (
    <Routes>
				<Route path='/' element={<Home />} />
        <Route path='/products' element={<ProductsPage />} />
    </Routes>
  )
}

export default App
