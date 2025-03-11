import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation(); // Intégration de la traduction
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 shadow-lg z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        {/* Logo à gauche */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
          <span className="text-white text-2xl font-bold">Finance<span className="text-blue-500">App</span></span>

          </Link>
        </div>

        {/* Navigation links au centre */}
        <div className="hidden md:flex space-x-8 mx-8">
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-blue-400 transition duration-300">
                {t("dashboard")}
              </Link>
              <Link to="/budgeting" className="text-gray-300 hover:text-blue-400 transition duration-300">
                {t("budget")}
              </Link>
              <Link to="/project" className="text-gray-300 hover:text-blue-400 transition duration-300">
                {t("projects")}
              </Link>
              <Link to="/payment" className="text-gray-300 hover:text-blue-400 transition duration-300">
                {t("payments")}
              </Link>
            </>
          )}
          <Link to="/about" className="text-gray-300 hover:text-blue-400 transition duration-300">
            {t("about")}
          </Link>
        </div>

        {/* Right side: Auth */}
        <div className="flex items-center space-x-6">
          {/* Bouton de déconnexion à droite */}
          {isAuthenticated ? (
            <>
              <button
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="hidden md:inline px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <div className="hidden md:flex space-x-4">
              <button
                onClick={() => loginWithRedirect()}
                className="px-6 py-2 border border-gray-500 text-gray-200 rounded-md hover:bg-gray-700 transition duration-300 text-sm"
              >
                {t("login")}
              </button>
              <button
                onClick={() => loginWithRedirect({ screen_hint: "signup" })}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm"
              >
                {t("signup")}
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-200 hover:text-white focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 py-4">
          <div className="px-6 space-y-4">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="block text-gray-300 hover:text-blue-400 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("dashboard")}
                </Link>
                <Link to="/budgeting" className="block text-gray-300 hover:text-blue-400 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("budget")}
                </Link>
                <Link to="/project" className="block text-gray-300 hover:text-blue-400 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("projects")}
                </Link>
                <Link to="/payment" className="block text-gray-300 hover:text-blue-400 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("payments")}
                </Link>
              </>
            )}
            <Link to="/about" className="block text-gray-300 hover:text-blue-400 transition duration-300" onClick={() => setIsMobileMenuOpen(false)}>
              {t("about")}
            </Link>
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    loginWithRedirect();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 text-white border border-gray-500 rounded-md hover:bg-gray-700 transition duration-300 text-sm"
                >
                  {t("login")}
                </button>
                <button
                  onClick={() => {
                    loginWithRedirect({ screen_hint: "signup" });
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm"
                >
                  {t("signup")}
                </button>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout({ logoutParams: { returnTo: window.location.origin } });
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-sm"
              >
                {t("logout")}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
