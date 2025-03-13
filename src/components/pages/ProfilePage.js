import React from "react";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-6">
          Profil
        </h1>
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-lg border border-gray-700/50">
            <h2 className="text-2xl font-semibold">
              Informations personnelles
            </h2>
            <p className="text-gray-300 mt-2">Nom: John Doe</p>
            <p className="text-gray-300 mt-2">Email: john.doe@example.com</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-lg border border-gray-700/50">
            <h2 className="text-2xl font-semibold">Historique des activités</h2>
            <p className="text-gray-300 mt-2">Aucune activité récente.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
