// ProfilePage.js
import React, { useState } from "react";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ici, on appelle ton backend (Spring Boot) pour modifier les infos
    try {
      const response = await fetch("/api/users/updateCredentials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // éventuellement un Bearer token si ton backend en a besoin
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Une erreur est survenue lors de la mise à jour.");
      }
      alert("Informations mises à jour avec succès !");
    } catch (error) {
      console.error(error);
      alert("Impossible de mettre à jour les informations.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-6">
          Profil
        </h1>

        {/* SECTION: Infos actuelles (ton code existant) */}
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-lg border border-gray-700/50">
            <h2 className="text-2xl font-semibold">
              Informations personnelles
            </h2>
            <p className="text-gray-300 mt-2">Nom: John Doe</p>
            <p className="text-gray-300 mt-2">Email: john.doe@example.com</p>
          </div>
        </div>

        {/* SECTION: Formulaire de modification */}
        <div className="mt-8 p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-lg border border-gray-700/50">
          <h2 className="text-2xl font-semibold mb-4">
            Modifier mes identifiants
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Nouveau Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Nouveau Mot de Passe
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-medium"
            >
              Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
