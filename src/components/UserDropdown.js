// UserDropdown.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FiX, FiUser, FiSettings, FiLogOut } from "react-icons/fi";

const UserDropdown = ({ isDropdownOpen, setIsDropdownOpen }) => {
  const { user, logout } = useAuth0();
  const [menuHeight, setMenuHeight] = useState("0px");

  // Lorsque le menu s'ouvre, on mesure la hauteur totale du conteneur principal (#app-root)
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
      {/* Overlay pour fermer le menu lorsqu'on clique en dehors */}
      {isDropdownOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      {/* Menu latéral en position absolute, s'étendant sur la hauteur totale du contenu */}
      <div
        className={`absolute top-0 right-0 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isDropdownOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          width: "18rem", // largeur (équivalent à w-72)
          height: menuHeight,
          zIndex: 9999,
        }}
      >
        {/* En-tête du menu */}
        <div className="flex items-center border-b border-gray-700 px-4 py-4">
          <img
            src={user?.picture || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="ml-3 leading-tight">
            <div className="font-semibold">{user?.name || "Utilisateur"}</div>
            {user?.email && (
              <div className="text-sm text-gray-400">{user.email}</div>
            )}
          </div>
          <button
            onClick={() => setIsDropdownOpen(false)}
            className="ml-auto text-gray-400 hover:text-white"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Liens du menu */}
        <div className="px-2 py-2">
          <Link
            to="/profile"
            className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
            onClick={() => setIsDropdownOpen(false)}
          >
            <FiUser className="mr-2" />
            Profil
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
            onClick={() => setIsDropdownOpen(false)}
          >
            <FiSettings className="mr-2" />
            Paramètres
          </Link>
        </div>

        <div className="border-t border-gray-700 mt-2" />

        {/* Bouton de déconnexion */}
        <div className="px-2 py-2">
          <button
            onClick={() => {
              logout({ logoutParams: { returnTo: window.location.origin } });
              setIsDropdownOpen(false);
            }}
            className="flex items-center w-full px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
          >
            <FiLogOut className="mr-2" />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDropdown;
