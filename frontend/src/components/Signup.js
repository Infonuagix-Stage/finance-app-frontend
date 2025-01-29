import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("http://localhost:8080/api/v1/auth/signup", formData);
      setMessage("Utilisateur inscrit avec succès !");
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage("Erreur lors de l'inscription. Veuillez réessayer.");
      console.error("Erreur API:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-500">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen -mt-16">
        <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-96 border border-white/30">
          <h2 className="text-3xl font-extrabold text-center text-white mb-6">
            Inscription
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Nom"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/90 placeholder-gray-700"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/90 placeholder-gray-700"
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/90 placeholder-gray-700"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-4 rounded-lg text-white font-bold transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-teal-400 hover:opacity-90"
              }`}
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-white font-medium">{message}</p>
          )}
          <p className="mt-4 text-center text-sm text-white/80">
            Vous avez déjà un compte ?{" "}
            <a
              href="/login"
              className="text-white font-semibold underline hover:text-blue-200"
            >
              Connectez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
