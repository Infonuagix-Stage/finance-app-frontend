import React, { useState } from "react";
import ProjectForm from "./ProjectForm";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);

  // Ajouter un projet
  const addProject = (project) => {
    setProjects([...projects, project]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Mes Projets Financiers</h1>
      
      {/* Formulaire pour ajouter un projet */}
      <ProjectForm onCreate={addProject} />

      {/* Liste des projets */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Projets en cours</h2>
        {projects.length === 0 ? (
          <p className="text-gray-400">Aucun projet ajouté.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map((project, index) => (
              <li key={index} className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <p>🎯 Objectif: <strong>${project.targetAmount}</strong></p>
                <p>💰 Économisé: <strong>${project.savedAmount}</strong></p>
                <p>📆 Date limite: <strong>{project.deadline}</strong></p>
                <p>🔹 Priorité: <span className="uppercase">{project.priority}</span></p>
                <p>📊 Contribution mensuelle requise: <strong>${project.monthlyContribution.toFixed(2)}</strong></p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
