// import axios from "axios";

// const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth`; // Adjust if backend runs on another port

// export const login = async (email, password) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, { email, password });
//     if (response.data.token) {
//       localStorage.setItem("token", response.data.token); // Store JWT token
//     }
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data || "Login failed");
//   }
// };

// export const register = async (name, email, password) => {
//   try {
//     const response = await axios.post(`${API_URL}/register`, {
//       name,
//       email,
//       password,
//     });
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response?.data || "Registration failed");
//   }
// };

// export const logout = () => {
//   localStorage.removeItem("token"); // Remove token from localStorage
// };

// export const getToken = () => {
//   return localStorage.getItem("token"); // Get token from localStorage
// };