import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./ProjectForm.module.css";

interface Project {
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  priority: "low" | "medium" | "high";
  monthlyContribution: number;
}

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

    const monthsRemaining = Math.max(
      1,
      Math.ceil(
        (new Date(deadline).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      )
    );

    const monthlyContribution = (targetAmount - savedAmount) / monthsRemaining;

    onCreate({ name, targetAmount, savedAmount, deadline, priority, monthlyContribution });

    setName("");
    setTargetAmount("");
    setSavedAmount("");
    setDeadline("");
    setPriority("medium");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.projectForm}>
      <h2>{t("add_project")}</h2>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>{t("project_name")}</label>
        <input
          type="text"
          placeholder={t("project_name_placeholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>{t("target_amount")}</label>
        <input
          type="number"
          placeholder="Ex: 20000"
          value={targetAmount}
          onChange={(e) =>
            setTargetAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>{t("saved_amount")}</label>
        <input
          type="number"
          placeholder="Ex: 5000"
          value={savedAmount}
          onChange={(e) =>
            setSavedAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>{t("project_deadline")}</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={styles.formInput}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>{t("priority_level")}</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
          className={styles.formSelect}
        >
          <option value="low" className={styles.priorityOption}>
            {t("low")}
          </option>
          <option value="medium" className={styles.priorityOption}>
            {t("medium")}
          </option>
          <option value="high" className={styles.priorityOption}>
            {t("high")}
          </option>
        </select>
      </div>

      <button type="submit" className={styles.submitButton}>
        {t("create_project")}
      </button>
    </form>
  );
};

export default ProjectForm;
