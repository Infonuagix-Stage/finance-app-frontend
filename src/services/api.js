import axios from "axios";
import { getToken } from "./authService";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`, // Update with your backend's URL
  headers: {
    "Content-Type": "application/json",
  },
});
// Attach Authorization Header to Requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
