import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
//import logo from "../../assets/Logo.png";

const Register = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

    const validatePassword = (password) => password.length >= 8;

    const validateForm = () => {
        if (!formData.username.trim()) {
            toast.error(t("UsernameRequired"));
            return false;
        }

        if (!validateEmail(formData.email)) {
            toast.error(t("InvalidEmail"));
            return false;
        }

        if (!validatePassword(formData.password)) {
            toast.error(t("PasswordLength"));
            return false;
        }

        return true;
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            const response = await fetch(
                "",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message || t("RegistrationFailed"));
                return;
            }

            const data = await response.json();

            toast.success(t("RegistrationSuccess"));
            localStorage.setItem("token", data.token);

            if (data.role === "user") {
                navigate("/");
            }
        } catch (error) {
            console.error("Network Error:", error);
            toast.error(t("RegistrationFailed"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[100vh] flex items-center justify-center px-5 lg:px-0">
            <ToastContainer />
            <div className="flex justify-center flex-1 bg-white">
                {/* <div className="flex-1 hidden text-center md:flex">
                    <img
                        src="src\assets\logo.png"
                        className="w-[44rem] h-[43rem] bg-center bg-no-repeat bg-inherit rounded-lg justify-center items-center aspect-square"
                    ></img>
                </div> */}
                <div className="p-4 lg:w-1/2 xl:w-1/2 sm:p-[2rem]  md:w-1/3">
                    <div className="flex flex-col items-center">
                        <div className="text-center">
                            <h1 className="mt-4 mb-2 text-2xl font-extrabold text-blue-900 xl:text-4xl">
                                Đăng ký
                            </h1>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 w-full">
                            <div className="flex flex-col max-w-xs gap-4 mx-auto">
                                <label className="text-sm font-medium text-left text-gray-700">
                                    Tên đăng nhập
                                </label>
                                <input
                                    className="w-full px-5 py-3 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="text"
                                    name="username"
                                    placeholder="Nhập tên đăng nhập"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />

                                <label className="text-sm font-medium text-left text-gray-700">
                                    Mật khẩu
                                </label>
                                <div className="relative w-full">
                                    <input
                                        className="w-full px-5 py-3 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                                        type={passwordVisible ? "text" : "password"}
                                        name="password"
                                        placeholder="Nhập mật khẩu"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute text-gray-500 right-3 top-3"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? (
                                            <EyeInvisibleOutlined />
                                        ) : (
                                            <EyeOutlined />
                                        )}
                                    </button>
                                </div>

                                <label className="text-sm font-medium text-left text-gray-700">
                                    Email
                                </label>
                                <input
                                    className="w-full px-5 py-3 text-sm font-medium placeholder-gray-500 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="email"
                                    name="email"
                                    placeholder="Nhập email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center justify-center w-full py-4 mt-5 font-semibold tracking-wide text-gray-100 transition-all duration-300 ease-in-out bg-blue-900 rounded-lg  hover:bg-indigo-700 focus:shadow-outline focus:outline-none"
                                >
                                    {loading ? (
                                        "Đang xử lý..."
                                    ) : (
                                        <span className="ml-3">{"Đăng ký"}</span>
                                    )}
                                </button>
                                <p className="mt-2 mb-4 text-xs text-center text-gray-600">
                                    Bạn đã có tài khoản{" "} - {" "}
                                    <Link to="/login">
                                        <span className="font-semibold text-blue-900">
                                            Đăng nhập
                                        </span>
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
