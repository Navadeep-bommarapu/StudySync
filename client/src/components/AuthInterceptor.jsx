import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const AuthInterceptor = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Add a response interceptor
        const interceptor = axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response && error.response.status === 401) {
                    // If 401 Unauthorized, log out and redirect to login
                    AuthService.logout();
                    navigate("/");
                }
                return Promise.reject(error);
            }
        );

        // Clean up interceptor on unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]);

    return null; // This component doesn't render anything
};

export default AuthInterceptor;
