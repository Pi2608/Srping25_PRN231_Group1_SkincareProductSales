import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../../../AuthContext/AuthContext.jsx'
import Header from '../../../../Components/Header/Header.jsx'
import Footer from '../../../../Components/Footer/Footer.jsx'
import './ProfileLayout.css'

const ProfileLayout = ({children}) => {

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const location = useLocation();
  
    const isActive = (path) => location.pathname === path ? "active" : "";
  

    return (
        <div id="profile-layout">
            <Header />
            <div className="profile-container">
                <aside className="sidebar">
                    <div className="profile">
                        <h3>Le Dang Phuc Dat</h3>
                        <p>(K17 HCM)</p>
                    </div>
                    <nav>
                        <ul>
                            <li className={isActive('/profile')} onClick={() => navigate('/profile')}>Profile</li>
                            <li className={isActive('/profile/orders')} onClick={() => navigate('/profile/orders')}>Orders</li>
                            <li className={isActive('/profile/vouchers')} onClick={() => navigate('/profile/vouchers')}>Vouchers</li>
                            <li className={isActive('/profile/change-pwd')} onClick={() => navigate('/profile/change-pwd')}>Change Password</li>
                            <li onClick={logout}>Log out</li>
                        </ul>
                    </nav>
                </aside>
                {children}
            </div>
            <Footer />
        </div>
    )
}

export default ProfileLayout