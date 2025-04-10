import React from "react";
import styles from "./SettingsPage.module.css";

const SettingsPage: React.FC = () => {
  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsBox}>
        <h1 className={styles.settingsTitle}>Paramètres</h1>
        <div className={styles.settingsSections}>
          {/* Paramètres de compte */}
          <div className={styles.settingsCard}>
            <h2 className={styles.sectionTitle}>Paramètres de compte</h2>
            <p className={styles.sectionText}>Changer le mot de passe</p>
            <p className={styles.sectionText}>Gérer les notifications</p>
          </div>

          {/* Sécurité */}
          <div className={styles.settingsCard}>
            <h2 className={styles.sectionTitle}>Sécurité</h2>
            <p className={styles.sectionText}>Activer l'authentification à deux facteurs</p>
            <p className={styles.sectionText}>Voir les appareils connectés</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
