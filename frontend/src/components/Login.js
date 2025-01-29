import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        formData
      );
      setMessage("Connexion réussie !");
      console.log("Token reçu:", response.data.token);

      // Store the JWT in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      setMessage("Erreur lors de la connexion. Veuillez vérifier vos informations.");
      console.error("Erreur API:", error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-500">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen -mt-16">
        <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-96 border border-white/30">
          <h2 className="text-3xl font-extrabold text-center text-white mb-6">
            Connexion
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90 placeholder-gray-700"
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/90 placeholder-gray-700"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-4 rounded-lg text-white font-bold transition ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90"
              }`}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-white font-medium">{message}</p>
          )}
          <p className="mt-4 text-center text-sm text-white/80">
            Vous n'avez pas de compte ?{" "}
            <a
              href="/signup"
              className="text-white font-semibold underline hover:text-blue-200"
            >
              Inscrivez-vous
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
