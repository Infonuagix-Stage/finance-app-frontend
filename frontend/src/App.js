import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // 🔥 Ajout du CSS

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/users",
        formData
      );
      setMessage("Utilisateur ajouté avec succès !");
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage("Erreur lors de l'ajout de l'utilisateur.");
      console.error("Erreur API:", error);
    }
  };

  return (
    <div className="container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
