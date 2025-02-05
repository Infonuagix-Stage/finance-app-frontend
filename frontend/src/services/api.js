import axios from "axios";
import { getToken } from "./authServices";

const api = axios.create({
  baseURL:
    "http://financeapp-env-1.eba-rx23r9ye.us-east-1.elasticbeanstalk.com/api", // Update with your backend's URL
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
