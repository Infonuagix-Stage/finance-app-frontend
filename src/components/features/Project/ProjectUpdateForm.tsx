import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./ProjectUpdateForm.css"; // Import CSS file

// Define Project type
interface Project {
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  priority: "low" | "medium" | "high";
  monthlyContribution?: number;
}

// Define Props type
interface ProjectUpdateFormProps {
  initialProject: Project;
  onUpdate: (updatedProject: Project) => void;
}

const ProjectUpdateForm: React.FC<ProjectUpdateFormProps> = ({ initialProject, onUpdate }) => {
  const { t } = useTranslation("project");

  const [name, setName] = useState<string>(initialProject.name);
  const [targetAmount, setTargetAmount] = useState<number | "">(initialProject.targetAmount);
  const [savedAmount, setSavedAmount] = useState<number | "">(initialProject.savedAmount);
  const [deadline, setDeadline] = useState<string>(initialProject.deadline);
  const [priority, setPriority] = useState<"low" | "medium" | "high">(initialProject.priority || "medium");

  useEffect(() => {
    setName(initialProject.name);
    setTargetAmount(initialProject.targetAmount);
    setSavedAmount(initialProject.savedAmount);
    setDeadline(initialProject.deadline);
    setPriority(initialProject.priority || "medium");
  }, [initialProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (targetAmount === "" || savedAmount === "") return;

    // Calculate remaining months (min 1 month)
    const monthsRemaining = Math.max(
      1,
      Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))
    );

    // Calculate monthly contribution
    const monthlyContribution = (targetAmount - savedAmount) / monthsRemaining;

    // Prepare updated project data
    const updatedProject: Project = {
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
    <form onSubmit={handleSubmit} className="project-form">
      <h2>{t("edit_project")}</h2>

      {/* Project Name */}
      <div className="form-group">
        <label className="form-label">{t("project_name")}</label>
        <input
          type="text"
          placeholder={t("project_name_placeholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          required
        />
      </div>

      {/* Target Amount */}
      <div className="form-group">
        <label className="form-label">{t("target_amount")} ($)</label>
        <input
          type="number"
          placeholder="Ex: 20000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value === "" ? "" : Number(e.target.value))}
          className="form-input"
          required
        />
      </div>

      {/* Saved Amount */}
      <div className="form-group">
        <label className="form-label">{t("saved_amount")} ($)</label>
        <input
          type="number"
          placeholder="Ex: 5000"
          value={savedAmount}
          onChange={(e) => setSavedAmount(e.target.value === "" ? "" : Number(e.target.value))}
          className="form-input"
        />
      </div>

      {/* Deadline */}
      <div className="form-group">
        <label className="form-label">{t("project_deadline")}</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="form-input"
          required
        />
      </div>

      {/* Priority */}
      <div className="form-group">
        <label className="form-label">{t("priority_level")}</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
          className="form-select"
        >
          <option value="low" className="priority-option">{t("low")}</option>
          <option value="medium" className="priority-option">{t("medium")}</option>
          <option value="high" className="priority-option">{t("high")}</option>
        </select>
      </div>

      <button type="submit" className="submit-button">
        {t("update_project")}
      </button>
    </form>
  );
};

export default ProjectUpdateForm;
