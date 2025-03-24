import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTranslation } from "react-i18next";

const Navbar = ({ setIsDropdownOpen }) => {
  const { t } = useTranslation();
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg border-b border-gray-700 shadow-lg z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-white text-3xl font-extrabold tracking-wide"
        >
          Finance<span className="text-blue-400">App</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 text-lg">
          <Link
            to="/"
            className="text-gray-300 hover:text-blue-400 transition duration-300"
          >
            {t("home")}
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-blue-400 transition duration-300"
              >
                {t("dashboard")}
              </Link>
              <Link
                to="/budgeting"
                className="text-gray-300 hover:text-blue-400 transition duration-300"
              >
                {t("budget")}
              </Link>
              <Link
                to="/project"
                className="text-gray-300 hover:text-blue-400 transition duration-300"
              >
                {t("projects")}
              </Link>
              <Link
                to="/payment"
                className="text-gray-300 hover:text-blue-400 transition duration-300"
              >
                {t("payments")}
              </Link>
            </>
          )}
          <Link
            to="/about"
            className="text-gray-300 hover:text-blue-400 transition duration-300"
          >
            {t("about")}
          </Link>
        </div>

        {/* Right side: Auth */}
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline text-white font-medium">
                {t("welcome")}, {user?.name || user?.nickname}!
              </span>
              {/* L'image de profil déclenche l'ouverture du menu */}
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center text-white focus:outline-none"
              >
                <img
                  src={user?.picture || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              </button>
              <button
                onClick={() =>
                  logout({ logoutParams: { returnTo: window.location.origin } })
                }
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

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none transition z-50"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 py-4 transition-all duration-300">
          <div className="px-6 space-y-4">
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="block text-gray-300 hover:text-blue-400 transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("dashboard")}
                </Link>
                <Link
                  to="/budgeting"
                  className="block text-gray-300 hover:text-blue-400 transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("budget")}
                </Link>
                <Link
                  to="/project"
                  className="block text-gray-300 hover:text-blue-400 transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("projects")}
                </Link>
                <Link
                  to="/payment"
                  className="block text-gray-300 hover:text-blue-400 transition duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("payments")}
                </Link>
              </>
            )}
            <Link
              to="/about"
              className="block text-gray-300 hover:text-blue-400 transition duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("about")}
            </Link>
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    loginWithRedirect();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-center px-4 py-2 text-white border border-gray-500 rounded-md hover:bg-gray-700 transition"
                >
                  {t("login")}
                </button>
                <button
                  onClick={() => {
                    loginWithRedirect({ screen_hint: "signup" });
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-md"
                >
                  {t("signup")}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  logout({
                    logoutParams: { returnTo: window.location.origin },
                  });
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-md"
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
