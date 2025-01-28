import "./App.css";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  // Gérer le changement des champs du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Envoyer le formulaire au backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users",
        formData
      );
      setMessage("Utilisateur ajouté avec succès !");
      setFormData({ name: "", email: "", password: "" }); // Réinitialisation du formulaire
    } catch (error) {
      setMessage("Erreur lors de l'ajout de l'utilisateur.");
      console.error("Erreur API:", error);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
