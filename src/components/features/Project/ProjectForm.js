import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ProjectForm = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium"); // Utilisez "medium" au lieu de "Moyenne" pour correspondre aux clés JSON
  const { t } = useTranslation("project");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calcul du nombre de mois restants (min 1)
    const monthsRemaining = Math.max(
      1,
      Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30))
    );
    // Calcul de la contribution mensuelle
    const monthlyContribution = (targetAmount - savedAmount) / monthsRemaining;

    // Envoi des données du projet au composant parent
    onCreate({ name, targetAmount, savedAmount, deadline, priority, monthlyContribution });

    // Réinitialisation du formulaire
    setName("");
    setTargetAmount("");
    setSavedAmount("");
    setDeadline("");
    setPriority("medium"); // Réinitialiser à "medium"
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-gray-700/50 backdrop-blur-sm"
    >
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-8">
        {t("add_project")}
      </h2>

      {/* Nom du projet */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("project_name")}
        </label>
        <input
          type="text"
          placeholder={t("project_name_placeholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/50 border border-gray-600/50 transition-all duration-200 hover:border-teal-400/50"
          required
        />
      </div>

      {/* Montant cible */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("target_amount")}
        </label>
        <input
          type="number"
          placeholder="Ex: 20000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(Number(e.target.value))}
          className="w-full p-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/50 border border-gray-600/50 transition-all duration-200 hover:border-teal-400/50"
          required
        />
      </div>

      {/* Montant déjà économisé */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("saved_amount")}
        </label>
        <input
          type="number"
          placeholder="Ex: 5000"
          value={savedAmount}
          onChange={(e) => setSavedAmount(Number(e.target.value))}
          className="w-full p-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/50 border border-gray-600/50 transition-all duration-200 hover:border-teal-400/50"
        />
      </div>

      {/* Date limite */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("project_deadline")}
        </label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/50 border border-gray-600/50 transition-all duration-200 hover:border-teal-400/50"
          required
        />
      </div>

      {/* Priorité */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("priority_level")}
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/50 border border-gray-600/50 transition-all duration-200 hover:border-teal-400/50"
        >
          <option value="low" className="bg-gray-800 rounded-2xl">
            {t("low")}
          </option>
          <option value="medium" className="bg-gray-800 rounded-2xl">
            {t("medium")}
          </option>
          <option value="high" className="bg-gray-800 rounded-2xl">
            {t("high")}
          </option>
        </select>
      </div>

      {/* Bouton de soumission */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 transition-all duration-300 font-semibold text-white py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {t("create_project")}
      </button>
    </form>
  );
};

export default ProjectForm;