 // hooks/useAxiosAuth.js
 import axios from "axios";
 import { useAuth0 } from "@auth0/auth0-react";
 const useAxiosAuth = () => {
   const { getAccessTokenSilently } = useAuth0();
   const api = axios.create({
     baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
     headers: { "Content-Type": "application/json" },
   });

   api.interceptors.request.use(
     async (config) => {
       try {
         const token = await getAccessTokenSilently({
           authorizationParams: {
             audience: process.env.REACT_APP_AUTH0_AUDIENCE, 
           },
         });
          //console.log("Token récupéré :", token);
         config.headers.Authorization = `Bearer ${token}`;
         return config;
       } catch (error) {
         console.error("Erreur récupération token:", error);
         return config;
       }
     },
     (error) => Promise.reject(error)
   );

   return api;
};

 export default useAxiosAuth;
