import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FiX, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import styles from "./UserDropdown.module.css";

interface UserDropdownProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const { user, logout } = useAuth0();

  return (
    <>
      {/* Overlay (clique pour fermer) */}
      {isDropdownOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {/* Menu latéral */}
      <div className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}>
        <div className="dropdown-header">
        <div className="profile-block">
          <img
            src={user?.picture || "https://via.placeholder.com/40"}
            alt="Profile"
            className="profile-picture"
          />
          <div className="profile-name">
            {user?.nickname || "Utilisateur"}
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setIsDropdownOpen(false)}
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Liens dans le menu */}
        <div className={styles.menuContent}>
          <Link
            to="/profile"
            className={styles.menuItem}
            onClick={() => setIsDropdownOpen(false)}
          >
            <FiUser className={styles.menuIcon} />
            Profil
          </Link>
          <Link
            to="/settings"
            className={styles.menuItem}
            onClick={() => setIsDropdownOpen(false)}
          >
            <FiSettings className={styles.menuIcon} />
            Paramètres
          </Link>
        </div>

        {/* Déconnexion */}
        <div className={styles.menuFooter}>
          <button
            onClick={() => {
              logout({ logoutParams: { returnTo: window.location.origin } });
              setIsDropdownOpen(false);
            }}
            className={`${styles.menuItem} ${styles.logout}`}
          >
            <FiLogOut className={styles.menuIcon} />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDropdown;
