import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuthContext();

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900/70 backdrop-blur-md border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-2xl font-extrabold tracking-wide"
        >
          Finance<span className="text-blue-400">App</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/features"
            className="text-gray-300 hover:text-white transition font-medium"
          >
            Fonctionnalités
          </Link>
          <Link
            to="/pricing"
            className="text-gray-300 hover:text-white transition font-medium"
          >
            Tarifs
          </Link>
          <Link
            to="/about"
            className="text-gray-300 hover:text-white transition font-medium"
          >
            À propos
          </Link>
        </div>

        {/* Auth Buttons */}
        {!user && (
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-white border border-gray-500 rounded-md hover:bg-gray-700 transition"
            >
              Connexion
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-md"
            >
              Inscription
            </Link>
          </div>
        )}

        {user && (
          <div className="space-x-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 text-white border border-gray-500 rounded-md hover:bg-gray-700 transition"
            >
              Tableau de bord
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-md"
            >
              Deconnexion
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
