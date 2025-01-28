import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/users", formData);
      setMessage("Utilisateur ajouté avec succès !");
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage("Erreur lors de l'inscription.");
      console.error("Erreur API:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white bg-opacity-20 backdrop-blur-md p-8 rounded-xl shadow-xl w-96 border border-white/30">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Inscription
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 bg-gray-100/80 placeholder-gray-600"
          />
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
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white p-3 rounded-md hover:opacity-80 transition"
          >
            S'inscrire
          </button>
        </form>
        {message && <p className="mt-4 text-center text-white">{message}</p>}
      </div>
    </div>
  );
};

export default Signup;
