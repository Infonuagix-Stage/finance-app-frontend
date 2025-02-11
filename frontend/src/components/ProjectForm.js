import React, { useState } from "react";

const ProjectForm = ({ onCreate }) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Moyenne");

  const handleSubmit = (e) => {
    e.preventDefault();
    const monthsRemaining = Math.max(1, Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30)));
    const monthlyContribution = (targetAmount - savedAmount) / monthsRemaining;

    onCreate({ name, targetAmount, savedAmount, deadline, priority, monthlyContribution });

    setName("");
    setTargetAmount("");
    setSavedAmount("");
    setDeadline("");
    setPriority("Moyenne");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-white text-2xl font-semibold mb-6 text-center">Créer un projet</h2>

      {/* Project Name */}
      <div className="mb-4">
        <label className="text-gray-300 font-medium">Nom du projet</label>
        <input
          type="text"
          placeholder="Ex: Achat Maison"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mt-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Target Amount */}
      <div className="mb-4">
        <label className="text-gray-300 font-medium">Montant cible ($)</label>
        <input
          type="number"
          placeholder="Ex: 20000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(Number(e.target.value))}
          className="w-full p-3 mt-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* Saved Amount */}
      <div className="mb-4">
        <label className="text-gray-300 font-medium">Montant déjà économisé ($)</label>
        <input
          type="number"
          placeholder="Ex: 5000"
          value={savedAmount}
          onChange={(e) => setSavedAmount(Number(e.target.value))}
          className="w-full p-3 mt-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      {/* Deadline */}
      <div className="mb-4">
        <label className="text-gray-300 font-medium">Date limite</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-3 mt-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
          required
        />
      </div>

      {/* Priority */}
      <div className="mb-6">
        <label className="text-gray-300 font-medium">Priorité</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-3 mt-1 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="Basse">Basse</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Haute">Haute</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
      >
        Ajouter le projet
      </button>
    </form>
  );
};

export default ProjectForm;
