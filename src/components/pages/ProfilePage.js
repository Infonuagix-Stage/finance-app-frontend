import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const ProfilePage = () => {
  const { user } = useAuth0();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth0UserId: user.sub, // Récupéré via le token ou le contexte
            email: newEmail,
            password: newPassword,
            name: newName,
          }),
        }
      );
      if (!response.ok) throw new Error("Mise à jour impossible");
      alert("Mise à jour réussie !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-6 py-12">
      {/* ... tes autres sections ... */}
      <div className="mt-8 p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-lg border border-gray-700/50">
        <h2 className="text-2xl font-semibold mb-4">
          Modifier mes identifiants
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nouveau Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500"
              placeholder="john.doe@example.com"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Nouveau Mot de Passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Nouveau Nom</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-900 border border-gray-600 text-gray-100 focus:outline-none focus:border-blue-500"
              placeholder="John Doe"
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
  );
};

export default ProfilePage;
