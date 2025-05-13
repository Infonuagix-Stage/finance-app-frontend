import React, { useState, useContext } from "react";
import styles from "./SettingsPage.module.css";
import { useAuth0, LogoutOptions } from "@auth0/auth0-react";
import Confirmation from "../Confirmation";
import { ThemeContext } from "../../context/ThemeContext";

const SettingsPage: React.FC = () => {
  const { logout, getAccessTokenSilently } = useAuth0();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleAccountDeletion = async () => {
    const confirmed = window.confirm("Es-tu sûr de vouloir supprimer ton compte ? Cette action est irréversible.");
    if (!confirmed) return;
  
    try {
      const token = await getAccessTokenSilently();
  
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        alert("Compte supprimé avec succès.");
  
        const logoutOptions: LogoutOptions = {
          logoutParams: {
            returnTo: window.location.origin,
          },
        };
        logout(logoutOptions); // Redirection après suppression
      } else {
        alert("Erreur lors de la suppression du compte.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur est survenue.");
    }
  };
  

  const handleExport = (type: string, format: "json" | "csv") => {
    const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/exports/${type}?format=${format}`;
    window.open(baseUrl, "_blank");
  };

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsBox}>
        <h1 className={styles.settingsTitle}>Paramètres</h1>
        <div className={styles.settingsSections}>

          {/* Mode sombre / clair */}
          <div className={styles.settingsCard}>
            <h2 className={styles.sectionTitle}>Apparence</h2>
            <p className={styles.sectionText}>
              <label>
                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                Activer le mode sombre
              </label>
            </p>
          </div>

          {/* Exportation */}
          <div className={styles.settingsCard}>
            <h2 className={styles.sectionTitle}>Exportation de données</h2>
            <p className={styles.sectionText}>
              <button onClick={() => handleExport("projects", "json")}>Exporter projets (JSON)</button>
              <button onClick={() => handleExport("debts", "csv")}>Exporter dettes (CSV)</button>
              <button onClick={() => handleExport("transactions", "json")}>Exporter transactions (JSON)</button>
            </p>
          </div>

          {/* Suppression du compte */}
          <div className={styles.settingsCard}>
            <h2 className={styles.sectionTitle}>Suppression du compte</h2>
            <p className={styles.sectionText}>
              <button onClick={() => setIsDeleteModalOpen(true)} style={{ color: "red" }}>
                Supprimer mon compte
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      <Confirmation
        isOpen={isDeleteModalOpen}
        title="Supprimer votre compte"
        message="Cette action est irréversible. Voulez-vous vraiment supprimer votre compte ?"
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          handleAccountDeletion();
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default SettingsPage;
