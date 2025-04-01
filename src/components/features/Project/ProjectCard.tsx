import React from "react";
import RecordActions from "../../RecordActions";
import { calculateProjectProgress } from "../../../utils/projectCalculations";
import { useTranslation } from "react-i18next";
import "./ProjectCard.css"; // Import CSS file

// Define Project type
interface Project {
  id: string;
  name: string;
  savedAmount: number;
  targetAmount: number;
  deadline: string;
  priority: string;
  monthlyContribution?: number;
}

// Define Props type
interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const { t } = useTranslation("project");
  const progressPercentage = calculateProjectProgress(
    project.savedAmount,
    project.targetAmount
  );

  return (
    <div className="project-card">
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <h3 className="project-title">
        <span>🚀</span>
        {project.name}
      </h3>

      <div className="project-details">
        <div className="detail-row">
          <span>{t("goal")}:</span>
          <strong>${project.targetAmount.toFixed(2)}</strong>
        </div>
        <div className="detail-row">
          <span>{t("saved")}:</span>
          <strong>${project.savedAmount.toFixed(2)}</strong>
        </div>
        <div className="detail-row">
          <span>{t("deadline")}:</span>
          <strong>{new Date(project.deadline).toLocaleDateString()}</strong>
        </div>
        <div className="detail-row">
          <span>{t("priority")}:</span>
          <strong className="priority-text">{t(project.priority.toLowerCase())}</strong>
        </div>
        <div className="monthly-contribution">
          <p>{t("monthly_contribution")}:</p>
          <span className="contribution-value">
            ${(project.monthlyContribution || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Actions Menu */}
      <div className="actions-menu">
        <RecordActions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
};

export default ProjectCard;
