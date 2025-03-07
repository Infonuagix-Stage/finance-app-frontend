import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuthContext();

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-gray-800 backdrop-blur-md border-b border-gray-700 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/about" className="text-white text-2xl font-extrabold ">
          Finance<span className="text-blue-400 m-0">App</span>
        </Link>
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-9">
          {user && (
            <Link to="/dashboard" className="text-gray-300 hover:text-white">
              Vue d'ensemble
            </Link>
          )}
          {user && (
            <Link to="/budgeting" className="text-gray-300 hover:text-white">
              Mon Budget
            </Link>
          )}
          {user && (
            <Link to="/project" className="text-gray-300 hover:text-white ">
              Mes Projets
            </Link>
          )}
          {user && (
            <Link to="/payment" className="text-gray-300 hover:text-white ">
              Mes Paiements
            </Link>
          )}
          {user && (
            <Link to="/about" className="text-gray-300 hover:text-white ">
              À propos
            </Link>
          )}
        </div>
        {/* Auth Buttons */}
        {!user && (
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-white border border-gray-500 rounded-md hover:bg-gray-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-md"
            >
              Sign Up
            </Link>
          </div>
        )}
        {user && (
          <div className="space-x-4">
            <button
              onClick={logout}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition shadow-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
