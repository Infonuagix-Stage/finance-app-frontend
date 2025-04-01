import axios, { AxiosRequestConfig } from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`, // Ensure environment variable is correctly set
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization Header using Auth0
api.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    try {
      const { getAccessTokenSilently } = useAuth0();
      const token = await getAccessTokenSilently(); // Get token from Auth0

      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token from Auth0:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
