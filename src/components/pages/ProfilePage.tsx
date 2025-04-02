import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./ProfilePage.css";

const ProfilePage: React.FC = () => {
  const { user } = useAuth0();
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");

  // Handler pour mettre à jour l'email
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            auth0UserId: user.sub,
            email: newEmail || undefined,
            password: undefined,
            username: undefined,
          }),
        }
      );
      if (!response.ok) throw new Error("Mise à jour impossible");
      alert("Email mis à jour avec succès !");
      setNewEmail("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour de l'email");
    }
  };

  // Handler pour mettre à jour le mot de passe
  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            auth0UserId: user.sub,
            email: undefined,
            password: newPassword || undefined,
            username: undefined,
          }),
        }
      );
      if (!response.ok) throw new Error("Mise à jour impossible");
      alert("Mot de passe mis à jour avec succès !");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du mot de passe");
    }
  };

  // Handler pour mettre à jour le username
  const handleUsernameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            auth0UserId: user.sub,
            email: undefined,
            password: undefined,
            username: newUsername || undefined,
          }),
        }
      );
      if (!response.ok) throw new Error("Mise à jour impossible");
      alert("Username mis à jour avec succès !");
      setNewUsername("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du username");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-info">
          <h1 className="profile-title">Mon Profil</h1>
          <p className="profile-detail">
            <strong>Email enregistré :</strong> {user?.email}
          </p>
          <p className="profile-detail">
            <strong>Nom enregistré :</strong> {user?.nickname}
          </p>
        </div>

        <div className="forms-wrapper">
          {/* Formulaire pour l'Email */}
          <div className="form-card">
            <h2 className="form-card-title">Modifier l'Email</h2>
            <form onSubmit={handleEmailSubmit} className="form-fields">
              <div className="form-field">
                <label className="form-label">Nouvel Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="form-input"
                  placeholder="john.doe@example.com"
                />
              </div>
              <button type="submit" className="submit-btn">
                Mettre à jour l'Email
              </button>
            </form>
          </div>

          {/* Formulaire pour le Mot de Passe */}
          <div className="form-card">
            <h2 className="form-card-title">Modifier le Mot de Passe</h2>
            <form onSubmit={handlePasswordSubmit} className="form-fields">
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
              <button type="submit" className="submit-btn">
                Mettre à jour le Mot de Passe
              </button>
            </form>
          </div>

          {/* Formulaire pour le Username */}
          <div className="form-card">
            <h2 className="form-card-title">Modifier le Username</h2>
            <form onSubmit={handleUsernameSubmit} className="form-fields">
              <div className="form-field">
                <label className="form-label">Nouveau Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="form-input"
                  placeholder="Nouveau username"
                />
              </div>
              <button type="submit" className="submit-btn">
                Mettre à jour le Username
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
