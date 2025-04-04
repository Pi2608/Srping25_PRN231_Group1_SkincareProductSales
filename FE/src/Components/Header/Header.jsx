import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../AuthContext/AuthContext'
import './Header.css'

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginRedirect = () => {
        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
    };

    const { user, logout } = useAuth()

    return (
        <header className="home-header">
            <p>Skincare Haven</p>
            <nav>
                <ul>
                    <li onClick={() => navigate("/")}>Home</li>
                    <li onClick={() => navigate("/products")}>Products</li>
                    <li onClick={() => navigate("/about")}>About Us</li>
                    <li onClick={() => navigate("/contact")}>Contact</li>
                </ul>
            </nav>
            <div className="ult">
                {user ? (
                    <div className='ult-item'>
                        <div style={{ display: 'flex', alignItems: 'center'}} onClick={() => navigate('/profile/topup')}>
                            <p style={{ fontSize: '1.2rem', fontWeight: 600, marginRight: '5px' }}>{new Intl.NumberFormat('vi-VN').format(user.moneyAmount)}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M5 9V6.8c0-.44.36-.8.8-.8h16.4c.44 0 .8.36.8.8v8.4c0 .44-.36.8-.8.8H20M2.8 9h16.4a.8.8 0 0 1 .8.8v8.4a.8.8 0 0 1-.8.8H2.8a.8.8 0 0 1-.8-.8V9.8a.8.8 0 0 1 .8-.8Zm9.2 5a1 1 0 1 1-2 0a1 1 0 0 1 2 0Z"/></svg>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate('/cart')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2M1 2v2h2l3.6 7.59l-1.36 2.45c-.15.28-.24.61-.24.96a2 2 0 0 0 2 2h12v-2H7.42a.25.25 0 0 1-.25-.25q0-.075.03-.12L8.1 13h7.45c.75 0 1.41-.42 1.75-1.03l3.58-6.47c.07-.16.12-.33.12-.5a1 1 0 0 0-1-1H5.21l-.94-2M7 18c-1.11 0-2 .89-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2"/></svg>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center'}} onClick={() => navigate('/profile')}>
                            <p style={{ fontSize: '1.2rem', fontWeight: 600, marginRight: '5px' }}>{user.account}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/></svg>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center'}} onClick={() => logout()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z"/></svg>    
                        </div>
                    </div>
                ) : (
                    <div className="user">
                        <button onClick={handleLoginRedirect}>Login</button>
                        <button onClick={() => navigate('/register')}>Register</button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Header