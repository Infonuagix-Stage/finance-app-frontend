import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import i18n
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0
import { getProjectsForUser } from "../../../../services/projectService"; // Import service function

const SavingsWidget = () => {
  const { t } = useTranslation("dashboard"); 
  const { user, isAuthenticated, isLoading } = useAuth0(); // Use Auth0 hook
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  console.log("Auth0 User:", user);

  // Fetch projects from backend
  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchProjects = async () => {
        try {
          const fetchedProjects = await getProjectsForUser(user.sub); // Use Auth0 user ID
          setProjects(fetchedProjects);
        } catch (error) {
          console.error("Erreur lors de la récupération des projets:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProjects();
    }
  }, [user, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">{t("projects_savings")}</h3>
        <p className="text-gray-300">{t("loading_user")}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">{t("projects_savings")}</h3>
        <p className="text-gray-300">{t("please_login")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">{t("projects_savings")}</h3>
        <p className="text-gray-300">{t("loading_projects")}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">{t("projects_savings")}</h3>
      {projects.length === 0 ? (
        <p className="text-gray-300">{t("no_projects")}</p>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="mb-4">
            <h4 className="text-lg font-medium text-gray-200">{project.name}</h4>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((project.savedAmount / project.targetAmount) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-gray-300 mt-1">
              {Math.min((project.savedAmount / project.targetAmount) * 100, 100).toFixed(2)}% {t("goal_reached")}
            </p>
            <div className="text-gray-400 text-sm">
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
