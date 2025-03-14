import axios from "axios";

class ApiGateway {
    static API_BASE = "http://localhost:5276/";

    static axiosInstance = axios.create({
        baseURL: ApiGateway.API_BASE,
        headers: {
            "Content-Type": "application/json",
        },
    });

    static formDataAxiosInstance = axios.create({
        baseURL: ApiGateway.API_BASE,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    

    static setAuthToken(token) {
        ApiGateway.axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
    }

    //User APIs

    static async register(newUser) {
        try {
            console.log(newUser);
            const response = await ApiGateway.axiosInstance.post("User/Register", newUser);
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Registration error:", error);
            return null;
        }
    }

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

    static async createUser(user) {
        try {
            const newUser = {
                account: user.account,
                email: user.email,
                address: user.address,
                password: user.password,
                roleId: user.roleId,
                createdBy:'',
                updatedBy:'',
            }
            const response = await ApiGateway.axiosInstance.post("User/CreateUser", user);
            return response.data;
        } catch (error) {
            console.error("Create User error:", error);
            throw error;
        }
    }

    static async changePassword(oldPwd, newPwd) {
        try {
            const password = {
                oldPassword: oldPwd,
                newPassword: newPwd,
            };
            const response = await ApiGateway.axiosInstance.put(`/User/ChangePassword`, password);
            return response.data;
        } catch (error) {
            console.error("Change Password error:", error);
            throw error;
        }
    }

    static async updateUser(userInfo) {
        try {
            const response = await ApiGateway.axiosInstance.put(`/User/UpdateProfile`, userInfo);
            return response.data;
        } catch (error) {
            console.error("Update Profile error:", error);
            throw error;
        }
    }

    //Role APIs

    static async getRole() {
        try {
            const response = await ApiGateway.axiosInstance.get("/Role/GetCurrentUserRole");
            return response.data;
        } catch (error) {
            console.error("Get Role error:", error);
            throw error;
        }
    }

    static async getRoles() {
        try {
            const response = await ApiGateway.axiosInstance.get("/Role/GetAllRoles");
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Get Roles error:", error);
            throw error;
        }
    }

    //RatingReview APIs

    static async getAllFeedback() {
        try {
            const response = await this.axiosInstance.get("/RatingReview");
            return response.data;
        } catch (error) {
            console.error("Error fetching all feedback:", error);
            throw error;
        }
    }

    static async getFeedbackByProduct(productId) {
        try {
            const response = await this.axiosInstance.get(`/RatingReview/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching feedback for product ${productId}:`, error);
            throw error;
        }
    }

    static async createFeedback(feedback) {/*{ productId: string; rating: number; comment: string }*/
        try {
            const response = await this.axiosInstance.post("/RatingReview", feedback);
            return response.data;
        } catch (error) {
            console.error("Error creating feedback:", error);
            throw error;
        }
    }

    static async updateFeedback(feedbackId, feedback) {/*string: { rating: number; comment: string }*/
        try {
            const response = await this.axiosInstance.put(`/RatingReview/${feedbackId}`, feedback);
            return response.data;
        } catch (error) {
            console.error(`Error updating feedback ${feedbackId}:`, error);
            throw error;
        }
    }

    static async deleteFeedback(feedbackId) {
        try {
            const response = await this.axiosInstance.delete(`/RatingReview?feedbackId=${feedbackId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting feedback ${feedbackId}:`, error);
            throw error;
        }
    }

    //Category APIs

    static async getAllCategories() {
        try {
            const response = await this.axiosInstance.get("/Category/GetAllCategory");
            return response.data;
        } catch (error) {
            console.error("Error fetching all categories:", error);
            throw error;
        }
    }

    //Product APIs

    static async getAllProducts() {
        try {
            const response = await this.axiosInstance.get("/Product/GetAllProducts");
            return response.data;
        } catch (error) {
            console.error("Error fetching all products:", error);
            throw error;
        }
    }

    static async getProductById(id) {
        try {
            const response = await this.axiosInstance.get(`/Product/GetById?id=${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    }

    static async createProduct(product) {/*{ name: string; price: number; description: string }*/
        try {
            const response = await this.axiosInstance.post("/Product/CreateProduct", product);
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    }

    static async updateProduct(id, product) {/*{ name: string; price: number; description: string }*/
        try {
            const response = await this.axiosInstance.put(`/Product/UpdateProduct/${id}`, product);
            return response.data;
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw error;
        }
    }

    static async deleteProduct(id) {
        try {
            const response = await this.axiosInstance.delete(`/Product/DeleteProduct/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            throw error;
        }
    }

    //ProductDetail APIs

    static async getAllProductDetails() {
        try {
          const response = await this.axiosInstance.get("/");
          return response.data;
        } catch (error) {
          console.error("Error fetching product details:", error);
          throw error;
        }
    };
    
    static async getProductDetailById(id) {
        try {
            const response = await this.axiosInstance.get(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product detail by ID:", error);
            throw error;
        }
    };
    
    static async getProductDetailByProductId(productId) {
        try {
            const response = await this.axiosInstance.get(`ProductDetail/GetProductDetailByProductId?productId=${productId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product details by ProductId:", error);
            throw error;
        }
    };
    
    static async createProductDetail(productDetail) {
        try {
            const response = await this.axiosInstance.post("/", productDetail);
            return response.data;
        } catch (error) {
            console.error("Error creating product detail:", error);
            throw error;
        }
    };
    
    static async updateProductDetail(id, updatedProductDetail) {
        try {
            const response = await this.axiosInstance.put(`/${id}`, updatedProductDetail);
            return response.data;
        } catch (error) {
            console.error("Error updating product detail:", error);
            throw error;
        }
    };
    
    static async deleteProductDetail(id) {
        try {
            const response = await this.axiosInstance.delete(`/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting product detail:", error);
            throw error;
        }
    };
    
    //Order APIs

     static async getAllOrders() {
        try {
            const response = await this.axiosInstance.get("/Order/GetAllOrder");
            return response.data;
        } catch (error) {
            console.error("Error fetching all orders:", error);
            throw error;
        }
    }

    static async getOrderById(id) {
        try {
            const response = await this.axiosInstance.get(`/Order/GetById/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching order ${id}:`, error);
            throw error;
        }
    }

    static async getOrderByUserId() {
        try {
            const response = await this.axiosInstance.get(`/Order/GetAllOrderByCurrentUserId`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching order ${id}:`, error);
            throw error;
        }
    }

    static async createOrder() {
        try {
            var order = {  isDeleted :  false };
            const response = await this.axiosInstance.post("/Order/CreateOrder", order);
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    }

    static async updateOrder(id, order) {/*{ items: any[]; totalPrice: number }*/
        try {
            const response = await this.axiosInstance.put(`/Order/UpdateOrder/${id}`, order);
            return response.data;
        } catch (error) {
            console.error(`Error updating order ${id}:`, error);
            throw error;
        }
    }


    static async deleteOrder(id) {
        try {
            const response = await this.axiosInstance.delete(`/Order/DeleteOrder/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting order ${id}:`, error);
            throw error;
        }
    }

    //OrderDetail APIs

    static async getOrderDetails(orderId) {
        try {
            const response = await this.axiosInstance.get(`/OrderDetail/GetOrderDetail?orderId=${orderId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all order details:", error);
            throw error;
        }
    }

    static async createOrderDetail(orderId, orderDetail) {
        try {
            const response = await this.axiosInstance.post(`/OrderDetail/CreateOrderDetail?orderId=${orderId}`, orderDetail);
            return response.data;
        } catch (error) {
            console.error("Error creating order detail:", error);
            throw error;
        }
    }

    static async updateOrderDetail(orderId, orderDetail) {
        try {
            const response = await this.axiosInstance.put(`/OrderDetail/UpdateOrderDetail?orderId=${orderId}`, orderDetail);
            return response.data;
        } catch (error) {
            console.error(`Error updating order detail ${id}:`, error);
            throw error;
        }
    }

    static async deleteOrderDetail(orderId) {
        try {
            const response = await this.axiosInstance.delete(`/OrderDetail/DeleteOrderDetail?orderId=${orderId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting order detail ${id}:`, error);
            throw error;
        }
    }
}

export default ApiGateway;
