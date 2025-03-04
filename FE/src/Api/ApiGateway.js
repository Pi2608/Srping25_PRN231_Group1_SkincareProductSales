import axios from "axios";

class ApiGateway {
    static API_BASE = "https://localhost:7118/";

    static axiosInstance = axios.create({
        baseURL: ApiGateway.API_BASE,
        headers: {
            "Content-Type": "application/json",
        },
    });

    static setAuthToken(token) {
        ApiGateway.axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    }

    // static async register(username, email, password, address) {
    //     try {
    //         const response = await ApiGateway.axiosInstance.post("User/Register", {
    //             username,
    //             email,
    //             password,
    //             address,
    //         });
    //         return response.data;
    //     } catch (error) {
    //         console.error("Registration error:", error);
    //         return null;
    //     }
    // }

    static async login(email, password) {
        try {
            const response = await ApiGateway.axiosInstance.get(`User/Login?email=${email}&password=${password}`);
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            return null;
        }
    }

    static async getAllUsers() {
        try {
            const response = await ApiGateway.axiosInstance.get("User/GetAllUser");
            return response.data;
        } catch (error) {
            console.error("Get All Users error:", error);
            throw error;
        }
    }

    static async getUserById() {
        try {
            const response = await ApiGateway.axiosInstance.get(`User/GetUser`);
            return response.data;
        } catch (error) {
            console.error("Get User by ID error:", error);
            throw error;
        }
    }

    static async getRole() {
        try {
            const response = await ApiGateway.axiosInstance.get("/Role/GetUserRole");
            return response.data;
        } catch (error) {
            console.error("Get Role error:", error);
            throw error;
        }
    }
}

export default ApiGateway;
