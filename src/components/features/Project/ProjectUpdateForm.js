import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const ProjectUpdateForm = ({ initialProject, onUpdate }) => {
  const { t } = useTranslation("project");

  const [name, setName] = useState(initialProject.name);
  const [targetAmount, setTargetAmount] = useState(initialProject.targetAmount);
  const [savedAmount, setSavedAmount] = useState(initialProject.savedAmount);
  const [deadline, setDeadline] = useState(initialProject.deadline);
  const [priority, setPriority] = useState(initialProject.priority || "medium");

  useEffect(() => {
    setName(initialProject.name);
    setTargetAmount(initialProject.targetAmount);
    setSavedAmount(initialProject.savedAmount);
    setDeadline(initialProject.deadline);
    setPriority(initialProject.priority || "medium");
  }, [initialProject]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const monthsRemaining = Math.max(
      1,
      Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30))
    );
    const monthlyContribution = (targetAmount - savedAmount) / monthsRemaining;

    const updatedProject = {
      name,
      targetAmount,
      savedAmount,
      deadline,
      priority,
      monthlyContribution,
    };

    onUpdate(updatedProject);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto border border-gray-700/50 backdrop-blur-sm"
    >
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-8">
        {t("edit_project")}
      </h2>

      {/* Project Name */}
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

      {/* Target Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("target_amount")} ($)
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

      {/* Saved Amount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("saved_amount")} ($)
        </label>
        <input
          type="number"
          placeholder="Ex: 5000"
          value={savedAmount}
          onChange={(e) => setSavedAmount(Number(e.target.value))}
          className="w-full p-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400/50 border border-gray-600/50 transition-all duration-200 hover:border-teal-400/50"
        />
      </div>

      {/* Deadline */}
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

      {/* Priority */}
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

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 transition-all duration-300 font-semibold text-white py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {t("update_project")}
      </button>
    </form>
  );
};

export default ProjectUpdateForm;
