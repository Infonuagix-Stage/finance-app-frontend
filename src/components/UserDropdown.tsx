import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FiX, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import "./UserDropdown.css"; // Import the CSS file

interface UserDropdownProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ isDropdownOpen, setIsDropdownOpen }) => {
  const { user, logout } = useAuth0();
  const [menuHeight, setMenuHeight] = useState<string>("0px");

  useEffect(() => {
    if (isDropdownOpen) {
      const appRoot = document.getElementById("app-root");
      if (appRoot) {
        setMenuHeight(`${appRoot.scrollHeight}px`);
      }
    }
  }, [isDropdownOpen]);

  return (
    <>
      {isDropdownOpen && <div className="overlay" onClick={() => setIsDropdownOpen(false)} />}

      <div
        className={`dropdown-menu ${isDropdownOpen ? "open" : ""}`}
        style={{ height: menuHeight }}
      >
        <div className="dropdown-header">
          <img
            src={user?.picture || "https://via.placeholder.com/40"}
            alt="Profile"
            className="profile-picture"
          />
          <div className="profile-info">
            <div className="profile-name">{user?.name || "Utilisateur"}</div>
            {user?.email && <div className="profile-email">{user.email}</div>}
          </div>
          <button className="close-btn" onClick={() => setIsDropdownOpen(false)}>
            <FiX size={20} />
          </button>
        </div>

        <div className="menu-links">
          <Link to="/profile" className="menu-item" onClick={() => setIsDropdownOpen(false)}>
            <FiUser className="menu-icon" />
            Profil
          </Link>
          <Link to="/settings" className="menu-item" onClick={() => setIsDropdownOpen(false)}>
            <FiSettings className="menu-icon" />
            Paramètres
          </Link>
        </div>

        <div className="divider" />

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
