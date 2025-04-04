import React from 'react';
import Banner from '../../../assets/product-img.png';
import Header from '../../../Components/Header/Header';
import Footer from '../../../Components/Footer/Footer';
import Products from './Product/Product';
import Review from './Review/Review';
import { useNavigate } from 'react-router-dom';
import './Home.css'; 

const Home = () => {

  const navigate = useNavigate();

  return (
    <div className="home">
      <Header/>
      
      <section className="home-banner">
        <div className='banner-left'>
          <p>Discover the best skincare products tailored for you.</p>
          <button className='discover' onClick={() => navigate('/products')}>Discover</button>
        </div>
        <div className="banner-right">
          <img src={Banner} alt="Banner" />
        </div>
      </section>
      
      {/* <section className="about-company" id="products">
        <h2>About Company</h2>
        <div className="product-list">
          <div className="product-item">
            <h3>Product 1</h3>
            <p>Description of Product 1</p>
          </div>
          <div className="product-item">
            <h3>Product 2</h3>
            <p>Description of Product 2</p>
          </div>
          <div className="product-item">
            <h3>Product 3</h3>
            <p>Description of Product 3</p>
          </div>
        </div>
      </section>
       */}

       <Products/>
       <Review/>
      <Footer/>
    </div>
  );
}

export default Home;