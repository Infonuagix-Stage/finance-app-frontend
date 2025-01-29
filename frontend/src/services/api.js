import axios from "axios";
import { getToken } from "./authService";

const API = axios.create({
    baseURL: "http://localhost:8080/api/v1", // Base URL for all API requests
});

// Attach Authorization Header to Requests
API.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default API;
