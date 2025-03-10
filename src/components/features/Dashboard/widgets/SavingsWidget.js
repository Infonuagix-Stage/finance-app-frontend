import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0
import { getProjectsForUser } from "../../../../services/projectService"; // Import service function

const SavingsWidget = () => {
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
        <h3 className="text-xl font-semibold mb-4">Projets et Épargne</h3>
        <p className="text-gray-300">Chargement de l'utilisateur...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Projets et Épargne</h3>
        <p className="text-gray-300">Veuillez vous connecter pour voir vos projets.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Projets et Épargne</h3>
        <p className="text-gray-300">Chargement des projets...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Projets et Épargne</h3>
      {projects.length === 0 ? (
        <p className="text-gray-300">Aucun projet en cours.</p>
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
              {Math.min((project.savedAmount / project.targetAmount) * 100, 100).toFixed(2)}% de l'objectif atteint
            </p>
            <div className="text-gray-400 text-sm">
              <p>Objectif : ${project.targetAmount}</p>
              <p>Économisé : ${project.savedAmount}</p>
              <p>Priorité : {project.priority}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavingsWidget;
