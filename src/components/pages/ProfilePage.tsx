import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./ProfilePage.module.css";

const ProfilePage: React.FC = () => {
  const { user } = useAuth0();
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newUsername, setNewUsername] = useState<string>("");

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.sub) return alert("Utilisateur non authentifié");
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth0UserId: user.sub,
          email: newEmail || undefined,
          password: undefined,
          name: undefined,
        }),
      });
      if (!response.ok) throw new Error("Mise à jour impossible");
      alert("Email mis à jour avec succès !");
      setNewEmail("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour de l'email");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.sub) return alert("Utilisateur non authentifié");
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth0UserId: user.sub,
          email: undefined,
          password: newPassword || undefined,
          name: undefined,
        }),
      });
      if (!response.ok) throw new Error("Mise à jour impossible");
      alert("Mot de passe mis à jour avec succès !");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du mot de passe");
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.sub) return alert("Utilisateur non authentifié");
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth0UserId: user.sub,
          email: undefined,
          password: undefined,
          name: newUsername || undefined,
        }),
      });
      if (!response.ok) throw new Error("Mise à jour impossible");
      alert("Username mis à jour avec succès !");
      setNewUsername("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du username");
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileContent}>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileTitle}>Mon Profil</h1>
          <p className={styles.profileDetail}>
            <strong>Email enregistré :</strong> {user?.email}
          </p>
          <p className={styles.profileDetail}>
            <strong>Nom enregistré :</strong> {user?.nickname}
          </p>
        </div>

        <div className={styles.formsWrapper}>
          {/* Email */}
          <div className={styles.formCard}>
            <h2 className={styles.formCardTitle}>Modifier l'Email</h2>
            <form onSubmit={handleEmailSubmit} className={styles.formFields}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Nouvel Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className={styles.formInput}
                  placeholder="john.doe@example.com"
                />
              </div>
              <button type="submit" className={styles.submitBtn}>
                Mettre à jour l'Email
              </button>
            </form>
          </div>

          {/* Mot de passe */}
          <div className={styles.formCard}>
            <h2 className={styles.formCardTitle}>Modifier le Mot de Passe</h2>
            <form onSubmit={handlePasswordSubmit} className={styles.formFields}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Nouveau Mot de Passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.formInput}
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" className={styles.submitBtn}>
                Mettre à jour le Mot de Passe
              </button>
            </form>
          </div>

          {/* Username */}
          <div className={styles.formCard}>
            <h2 className={styles.formCardTitle}>Modifier le Username</h2>
            <form onSubmit={handleUsernameSubmit} className={styles.formFields}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Nouveau Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className={styles.formInput}
                  placeholder="Nouveau username"
                />
              </div>
              <button type="submit" className={styles.submitBtn}>
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
