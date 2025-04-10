import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import { getProjectsForUser } from "../../../../services/projectService";
import styles from "./SavingWidget.module.css";

interface Project {
  id: string;
  name: string;
  savedAmount: number;
  targetAmount: number;
  priority: string;
}

const SavingsWidget: React.FC = () => {
  const { t } = useTranslation("dashboard");
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isAuthenticated && user?.sub) {
      const fetchProjects = async () => {
        try {
          const token = await getAccessTokenSilently();
          if (!user.sub) return;

          const fetchedProjects = await getProjectsForUser(user.sub, token);
          setProjects(
            fetchedProjects.map((p) => ({
              ...p,
              savedAmount: p.savedAmount ?? 0,
              targetAmount: p.targetAmount ?? 100,
              priority: p.priority ?? "Medium",
            }))
          );
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProjects();
    }
  }, [user, isAuthenticated, getAccessTokenSilently]);

  if (isLoading || loading) {
    return (
      <div className={styles.savingsWidget}>
        <h3 className={styles.savingsWidgetTitle}>{t("projects_savings")}</h3>
        <p className={styles.savingsWidgetText}>{t("loading_projects")}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.savingsWidget}>
        <h3 className={styles.savingsWidgetTitle}>{t("projects_savings")}</h3>
        <p className={styles.savingsWidgetText}>{t("please_login")}</p>
      </div>
    );
  }

  return (
    <div className={styles.savingsWidget}>
      <h3 className={styles.savingsWidgetTitle}>{t("projects_savings")}</h3>
      {projects.length === 0 ? (
        <p className={styles.savingsWidgetText}>{t("no_projects")}</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className={styles.projectContainer}>
            <h4 className={styles.projectTitle}>{project.name}</h4>
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{
                  width: `${Math.min(
                    (project.savedAmount / project.targetAmount) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className={styles.savingsWidgetText}>
              {Math.min(
                (project.savedAmount / project.targetAmount) * 100,
                100
              ).toFixed(2)}
              % {t("goal_reached")}
            </p>
            <div className={styles.projectDetails}>
              <p>{t("goal")}: ${project.targetAmount}</p>
              <p>{t("saved")}: ${project.savedAmount}</p>
              <p>{t("priority")}: {project.priority}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavingsWidget;
