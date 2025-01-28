import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/login",
        formData
      );
      setMessage("Connexion réussie !");
      console.log(response.data);
    } catch (error) {
      setMessage("Erreur lors de la connexion.");
      console.error("Erreur API:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-xl shadow-xl w-96 border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Connexion
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 bg-gray-100/80 placeholder-gray-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 bg-gray-100/80 placeholder-gray-600"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white p-3 rounded-md hover:opacity-80 transition"
          >
            Se connecter
          </button>
        </form>
        {message && <p className="mt-4 text-center text-white">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
