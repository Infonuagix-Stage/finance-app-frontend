import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const UserDropdown = () => {
  const { user, logout } = useAuth0();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-white focus:outline-none"
      >
        <img
          src={
            user?.picture ||
            "https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png"
          }
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <div className="py-2">
            <Link
              to="/profile"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
              onClick={() => setIsDropdownOpen(false)}
            >
              Profil
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
              onClick={() => setIsDropdownOpen(false)}
            >
              Paramètres
            </Link>
            <button
              onClick={() => {
                logout({ logoutParams: { returnTo: window.location.origin } });
                setIsDropdownOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700"
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
