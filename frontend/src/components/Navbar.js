import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-md p-4 fixed top-0 left-0 w-full flex justify-between items-center shadow-lg border-b border-white/20">
      <h1 className="text-white text-2xl font-bold px-4">Finance App </h1>
      <div className="space-x-4 px-4">
        <Link
          to="/signup"
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-md hover:opacity-80 transition"
        >
          Inscription
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-md hover:opacity-80 transition"
        >
          Connexion
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
