import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./ProjectForm.css"; // Import CSS file

// Define Project type
interface Project {
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  priority: "low" | "medium" | "high";
  monthlyContribution: number;
}

// Define Props type
interface ProjectFormProps {
  onCreate: (project: Project) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onCreate }) => {
  const [name, setName] = useState<string>("");
  const [targetAmount, setTargetAmount] = useState<number | "">("");
  const [savedAmount, setSavedAmount] = useState<number | "">("");
  const [deadline, setDeadline] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const { t } = useTranslation("project");

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

    // Send data to parent component
    onCreate({ name, targetAmount, savedAmount, deadline, priority, monthlyContribution });

    // Reset form fields
    setName("");
    setTargetAmount("");
    setSavedAmount("");
    setDeadline("");
    setPriority("medium");
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <h2>{t("add_project")}</h2>

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
        <label className="form-label">{t("target_amount")}</label>
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
        <label className="form-label">{t("saved_amount")}</label>
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

      {/* Submit Button */}
      <button type="submit" className="submit-button">
        {t("create_project")}
      </button>
    </form>
  );
};

export default ProjectForm;
