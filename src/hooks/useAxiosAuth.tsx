import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const useAxiosAuth = (): AxiosInstance => {
  const { getAccessTokenSilently } = useAuth0();

  const api = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`, // Corrected for CRA
    headers: { "Content-Type": "application/json" },
  });

  api.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE, // Corrected for CRA
          },
        });

        if (config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      } catch (error) {
        console.error("Error retrieving token:", error);
        return config;
      }
    },
    (error) => Promise.reject(error)
  );

  return api;
};

export default useAxiosAuth;
