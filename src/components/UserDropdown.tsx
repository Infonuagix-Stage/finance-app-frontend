import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FiX, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import "./UserDropdown.css";

interface UserDropdownProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  isDropdownOpen,
  setIsDropdownOpen
}) => {
  const { user, logout } = useAuth0();

  return (
    <>
      {/* Overlay (click pour fermer) */}
      {isDropdownOpen && (
        <div className="overlay" onClick={() => setIsDropdownOpen(false)} />
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
        </div>
          <button className="close-btn" onClick={() => setIsDropdownOpen(false)}>
            <FiX size={22} />
          </button>
        </div>

        {/* Liens dans le menu */}
        <div className="menu-content">
          <Link
            to="/profile"
            className="menu-item"
            onClick={() => setIsDropdownOpen(false)}
          >
            <FiUser className="menu-icon" />
            Profil
          </Link>
          <Link
            to="/settings"
            className="menu-item"
            onClick={() => setIsDropdownOpen(false)}
          >
            <FiSettings className="menu-icon" />
            Paramètres
          </Link>
        </div>

        {/* Déconnexion */}
        <div className="menu-footer">
          <button
            onClick={() => {
              logout({ logoutParams: { returnTo: window.location.origin } });
              setIsDropdownOpen(false);
            }}
            className="menu-item logout"
          >
            <FiLogOut className="menu-icon" />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDropdown;
