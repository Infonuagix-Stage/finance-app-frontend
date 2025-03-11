import React from "react";
import RecordActions from "../../RecordActions";
import { calculateProjectProgress } from "../../../utils/projectCalculations";
import { useTranslation } from "react-i18next";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const { t } = useTranslation("project");
  const progressPercentage = calculateProjectProgress(
    project.savedAmount,
    project.targetAmount
  );

  return (
    <div className="relative group bg-gray-800/50 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-teal-400 transition-all duration-300 hover:-translate-y-2">
      {/* Progress Bar */}
      <div className="h-2 bg-gray-700 rounded-full mb-4">
        <div
          className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <h3 className="text-xl font-bold mb-3 flex items-center">
        <span className="mr-2">🚀</span>
        {project.name}
      </h3>

      <div className="space-y-2 text-gray-300">
        <div className="flex justify-between">
          <span>{t("goal")}:</span>
          <strong>${project.targetAmount.toFixed(2)}</strong>
        </div>
        <div className="flex justify-between">
          <span>{t("saved")}:</span>
          <strong>${project.savedAmount.toFixed(2)}</strong>
        </div>
        <div className="flex justify-between">
          <span>{t("deadline")}:</span>
          <strong>{new Date(project.deadline).toLocaleDateString()}</strong>
        </div>
        <div className="flex justify-between">
          <span>{t("priority")}:</span>
          <strong className="uppercase text-teal-400">{t(project.priority.toLowerCase())}</strong>
        </div>
        <div className="pt-4 mt-4 border-t border-gray-700">
          <p className="text-center text-sm">
            {t("monthly_contribution")}:
            <span className="block text-lg font-bold text-teal-400">
              ${(project.monthlyContribution || 0).toFixed(2)}
            </span>
          </p>
        </div>
      </div>

      {/* Actions Menu */}
      <div className="absolute top-2 right-2">
        <RecordActions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
};

export default ProjectCard;
