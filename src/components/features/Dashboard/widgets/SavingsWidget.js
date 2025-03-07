// components/Dashboard/widgets/SavingsWidget.js
import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../../../context/AuthContext";
import { getProjectsForUser } from "../../../../services/projectService"; // Importez la fonction pour récupérer les projets

const SavingsWidget = () => {
  const { user } = useAuthContext(); // Récupérez l'utilisateur connecté
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // État de chargement

  console.log("user:", user);

  // Récupérez les projets depuis le backend
  useEffect(() => {
    if (user) {
      const fetchProjects = async () => {
        try {
          const fetchedProjects = await getProjectsForUser(user.userId);
          setProjects(fetchedProjects);
        } catch (error) {
          console.error("Erreur lors de la récupération des projets:", error);
        } finally {
          setLoading(false); // Arrêtez le chargement une fois les données récupérées
        }
      };

      fetchProjects();
    }
  }, [user]);

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
            <h4 className="text-lg font-medium text-gray-200">
              {project.name}
            </h4>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(
                    (project.savedAmount / project.targetAmount) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            <p className="text-gray-300 mt-1">
              {Math.min(
                (project.savedAmount / project.targetAmount) * 100,
                100
              ).toFixed(2)}
              % de l'objectif atteint
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
