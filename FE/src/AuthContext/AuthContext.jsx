import React, { createContext, useContext, useState, useEffect } from "react";
import ApiGateway from "../Api/ApiGateway.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        if (token) {
            ApiGateway.setAuthToken(token);
            fetchUser();
        }
    }, [token]);

    const register = async (newUser) => {
        try {
            const newToken = await ApiGateway.register(newUser);
            if (newToken) {
                sessionStorage.setItem("token", newToken);
                setToken(newToken);
                ApiGateway.setAuthToken(newToken);
                await fetchUser();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Register failed:", error);
            return false;
        }
    }

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
            const [userData, userRole] = await Promise.all([
                ApiGateway.getUserById(),
                ApiGateway.getRole()
            ]);
            setUser(userData);
            setRole(userRole);
            console.log("User data fetched:", userData);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        setToken("");
        setUser(null);
        setRole("");
        ApiGateway.setAuthToken(null); 
    };

    return (
        <AuthContext.Provider value={{ user, role, token, fetchUser, setUser, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
