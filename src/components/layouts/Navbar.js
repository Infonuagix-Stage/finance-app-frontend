import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-md border-b border-gray-700 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex justify-between items-center h-16">
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
        <div className="hidden md:flex space-x-4">
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

        {/* Mobile Menu Button and Logout */}
        <div className="md:hidden flex items-center space-x-4">
          {isAuthenticated && (
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="px-2 py-1 text-gray-300 border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          )}
          <button
            onClick={toggleMobileMenu}
            className="text-gray-300 hover:text-white focus:outline-none focus:text-white transition"
          >
            {isMobileMenuOpen ? (
              // Close Icon (X)
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger Icon
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-4 pt-4 pb-2 space-y-2">
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-300 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Vue d'ensemble
                </Link>
                <Link
                  to="/budgeting"
                  className="block text-gray-300 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mon Budget
                </Link>
                <Link
                  to="/project"
                  className="block text-gray-300 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mes Projets
                </Link>
                <Link
                  to="/payment"
                  className="block text-gray-300 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mes Paiements
                </Link>
                <Link
                  to="/about"
                  className="block text-gray-300 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  À propos
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-white border border-gray-500 rounded-md hover:bg-gray-700 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;