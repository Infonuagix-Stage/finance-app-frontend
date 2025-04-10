import React from "react";
import RecordActions from "../../RecordActions";
import { calculateProjectProgress } from "../../../utils/projectCalculations";
import { useTranslation } from "react-i18next";
import styles from "./ProjectCard.module.css";

interface Project {
  id: string;
  name: string;
  savedAmount: number;
  targetAmount: number;
  deadline: string;
  priority: string;
  monthlyContribution?: number;
}

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
    <div className={styles.projectCard}>
      {/* Progress Bar */}
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <h3 className={styles.projectTitle}>
        <span>🚀</span>
        {project.name}
      </h3>

      <div className={styles.projectDetails}>
        <div className={styles.detailRow}>
          <span>{t("goal")}:</span>
          <strong>${project.targetAmount.toFixed(2)}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>{t("saved")}:</span>
          <strong>${project.savedAmount.toFixed(2)}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>{t("deadline")}:</span>
          <strong>{new Date(project.deadline).toLocaleDateString()}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>{t("priority")}:</span>
          <strong className={styles.priorityText}>
            {t(project.priority.toLowerCase())}
          </strong>
        </div>
        <div className={styles.monthlyContribution}>
          <p>{t("monthly_contribution")}:</p>
          <span className={styles.contributionValue}>
            ${(project.monthlyContribution || 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Actions Menu */}
      <div className={styles.actionsMenu}>
        <RecordActions onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
};

export default ProjectCard;
