import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-gray-800 backdrop-blur-md border-b border-gray-700 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-extrabold">
          Finance<span className="text-blue-400">App</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-9">
          {/* Always visible links */}
          <Link to="/" className="text-gray-300 hover:text-white">Accueil</Link>
          <Link to="/about" className="text-gray-300 hover:text-white">À propos</Link>

          {/* Authenticated-only links */}
          {isAuthenticated && <Link to="/dashboard" className="text-gray-300 hover:text-white">Vue d'ensemble</Link>}
          {isAuthenticated && <Link to="/budgeting" className="text-gray-300 hover:text-white">Mon Budget</Link>}
          {isAuthenticated && <Link to="/project" className="text-gray-300 hover:text-white">Mes Projets</Link>}
          {isAuthenticated && <Link to="/payment" className="text-gray-300 hover:text-white">Mes Paiements</Link>}
        </div>

        {/* Auth Buttons */}
        <div className="space-x-4 flex items-center">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => loginWithRedirect()}
                className="px-4 py-2 text-white border border-gray-500 rounded-md hover:bg-gray-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => loginWithRedirect({ screen_hint: "signup" })}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-md"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <span className="text-white">Bienvenue, {user?.name}!</span>
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition shadow-md"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
