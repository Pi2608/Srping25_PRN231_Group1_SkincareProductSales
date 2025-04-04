import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiGateway from "../Api/ApiGateway.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [role, setRole] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                ApiGateway.setAuthToken(token);
                try {
                    await fetchUser();
                } catch (error) {
                    console.error("Failed to initialize auth:", error);
                    sessionStorage.removeItem("token");
                    setToken("");
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, [token]);

    const register = async (newUser) => {
        setIsLoading(true);
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
        } finally {
            setIsLoading(false); 
        }
    }

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const newToken = await ApiGateway.login(email, password);
            if (newToken) {
                sessionStorage.setItem("token", newToken);
                setToken(newToken);
                ApiGateway.setAuthToken(newToken);
                await fetchUser()
                checkUser();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const checkUser = async () => {
        switch(role) {
            case 'Admin':
                navigate('/dashboard/mng-user');
                break;
            case 'Customer':
                navigate('/');
                break;
            default:
                console.log("Something went wrong");
        }
    }

    const fetchUser = async () => {
        try {
            const [userData, userRole] = await Promise.all([
                ApiGateway.getUserById(),
                ApiGateway.getRole()
            ]);
            setUser(userData);
            setRole(userRole);
            console.log("User data fetched:", userData);
            return { userData, userRole };
        } catch (error) {
            console.error("Failed to fetch user:", error);
            throw error;
        }
    };

    const logout = () => {
        sessionStorage.removeItem("token");
        setToken("");
        setUser(null);
        setRole("");
        ApiGateway.setAuthToken(null); 
        navigate('/')
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            role, 
            token, 
            isLoading,
            fetchUser, 
            setUser, 
            register, 
            login, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);