import React from "react";
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  return (
    <div className="settings-container">
      <div className="settings-box">
        <h1 className="settings-title">Paramètres</h1>
        <div className="settings-sections">
          {/* Account Settings */}
          <div className="settings-card">
            <h2 className="section-title">Paramètres de compte</h2>
            <p className="section-text">Changer le mot de passe</p>
            <p className="section-text">Gérer les notifications</p>
          </div>

          {/* Security Settings */}
          <div className="settings-card">
            <h2 className="section-title">Sécurité</h2>
            <p className="section-text">Activer l'authentification à deux facteurs</p>
            <p className="section-text">Voir les appareils connectés</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
