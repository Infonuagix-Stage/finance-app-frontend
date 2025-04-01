import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user } = useAuth0();
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newName, setNewName] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.sub) {
      alert("Utilisateur non authentifié");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            auth0UserId: user.sub, // Auth0 User ID
            email: newEmail || undefined,
            password: newPassword || undefined,
            name: newName || undefined,
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
    <div className="profile-container">
      <div className="form-container">
        <h2 className="form-title">Modifier mes identifiants</h2>
        <form onSubmit={handleSubmit} className="form-fields">
          <div className="form-field">
            <label className="form-label">Nouveau Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="form-input"
              placeholder="john.doe@example.com"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Nouveau Mot de Passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Nouveau Nom</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="form-input"
              placeholder="John Doe"
            />
          </div>
          <button type="submit" className="submit-btn">
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
