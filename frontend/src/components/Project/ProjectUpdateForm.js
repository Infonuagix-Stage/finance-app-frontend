import React, { useState, useEffect } from "react";

const ProjectUpdateForm = ({ initialProject, onUpdate }) => {
  // Initialisation des états avec les valeurs existantes du projet
  const [name, setName] = useState(initialProject.name);
  const [targetAmount, setTargetAmount] = useState(initialProject.targetAmount);
  const [savedAmount, setSavedAmount] = useState(initialProject.savedAmount);
  const [deadline, setDeadline] = useState(initialProject.deadline);
  const [priority, setPriority] = useState(initialProject.priority || "Moyenne");

  // Si le projet change (par exemple, lors d'une réouverture du formulaire), on met à jour les états.
  useEffect(() => {
    setName(initialProject.name);
    setTargetAmount(initialProject.targetAmount);
    setSavedAmount(initialProject.savedAmount);
    setDeadline(initialProject.deadline);
    setPriority(initialProject.priority || "Moyenne");
  }, [initialProject]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calcul du nombre de mois restants (au moins 1)
    const monthsRemaining = Math.max(
      1,
      Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30))
    );
    // Calcul de la contribution mensuelle
    const monthlyContribution = (targetAmount - savedAmount) / monthsRemaining;

    // Préparation de l'objet mis à jour
    const updatedProject = {
      name,
      targetAmount,
      savedAmount,
      deadline,
      priority,
      monthlyContribution,
    };

    // Appel de la fonction de mise à jour passée en props
    onUpdate(updatedProject);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-gray-700/50 backdrop-blur-sm"
    >
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-8">
        Modifier le projet
      </h2>

      {/* Nom du projet */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Nom du projet
        </label>
        <input
          type="text"
          placeholder="Ex: Achat Maison"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/50 border border-gray-600/50 transition-all duration-200 hover:border-teal-400/50"
          required
        />
      </div>

      {/* Montant cible */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Montant cible ($)
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
          Montant déjà économisé ($)
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
          Date limite
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
          Priorité
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/50 border border-gray-600/50 transition-all duration-200 hover:border-teal-400/50"
        >
          <option value="Basse" className="bg-gray-800 rounded-2xl">
            Basse
          </option>
          <option value="Moyenne" className="bg-gray-800 rounded-2xl">
            Moyenne
          </option>
          <option value="Haute" className="bg-gray-800 rounded-2xl">
            Haute
          </option>
        </select>
      </div>

      {/* Bouton de soumission */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 transition-all duration-300 font-semibold text-white py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Mettre à jour le projet
      </button>
    </form>
  );
};

export default ProjectUpdateForm;
