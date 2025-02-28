import React, { createContext, useContext, useState, useEffect } from "react";
import ApiGateway from "../Api/ApiGateway.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(sessionStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            ApiGateway.setAuthToken(token);
            fetchUser();
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const newToken = await ApiGateway.login(email, password);
            if (newToken) {
                sessionStorage.setItem("token", newToken);
                setToken(newToken);
                ApiGateway.setAuthToken(newToken);
                await fetchUser();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const fetchUser = async () => {
        try {
            const userData = await ApiGateway.getUserById();
            setUser(userData);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        ApiGateway.setAuthToken(null); 
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
