import React, { useEffect, useState } from "react";
import ProjectForm from "./ProjectForm";
import { useAuthContext } from "../../context/AuthContext";
import { getProjectsForUser, createProjectForUser, deleteProjectForUser, updateProjectForUser } from "../../services/projectService";
import Confirmation from "../Confirmation"; // Modal de confirmation pour la suppression
import RecordActions from "../RecordActions"; // Menu à trois points pour actions
import ProjectUpdateForm from "./ProjectUpdateForm"; // Formulaire pour modifier un projet

const ProjectPage = () => {
  const { user, token } = useAuthContext(); // Récupération de l'utilisateur et du token
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [isModalOpen, setIsModalOpen] = useState(false); // Pour le modal de suppression
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [editingProject, setEditingProject] = useState(null); // Projet à modifier

  const handleOpenModal = (id) => {
    setSelectedProjectId(id);
    setIsModalOpen(true);
  };

  // Fermer le modal sans suppression
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedProjectId(null);
  };

  const handleConfirm = async () => {
    try {
      await deleteProjectForUser(user.id, selectedProjectId);
      setProjects(projects.filter(project => project.id !== selectedProjectId));
      setIsModalOpen(false);
      setSelectedProjectId(null);
    } catch (error) {
      console.log("Erreur lors de la suppression du projet: ", error);
    }
  };

  const addProject = async (newProject) => {
    try {
      const createdProject = await createProjectForUser(user.id, newProject);
      setProjects([...projects, createdProject]);
    } catch (error) {
      console.log("Erreur lors de la création du projet: ", error);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
  };

  const handleUpdateProject = async (updatedData) => {
    try {
      // Appel de l'API pour mettre à jour le projet
      console.log("Données envoyées au PUT (updateProjectForUser):", updatedData);
      const updatedProject = await updateProjectForUser(user.id, editingProject.id, updatedData);
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      setEditingProject(null);
    } catch (error) {
      console.log("Erreur lors de la mise à jour du projet: ", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjectsForUser(user.id, token);
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Erreur lors du chargement des projets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          Mes Projets Financiers
        </h1>
  
        {/* Section de création de projet */}
        <div className="mb-20">
          {loading ? (
            <div className="animate-pulse flex justify-center items-center h-32">
              <div className="w-12 h-12 rounded-full border-4 border-gray-600 border-t-teal-500 animate-spin"></div>
            </div>
          ) : (
            <ProjectForm onCreate={addProject} />
          )}
        </div>
  
        {/* Liste des projets */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            Projets en cours
          </h2>
  
          {projects.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-gray-700 rounded-xl">
              <p className="text-gray-400 text-lg">Aucun projet ajouté</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="relative group bg-gray-800/50 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-teal-400 transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Barre de progression */}
                  <div className="h-2 bg-gray-700 rounded-full mb-4">
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
  
                  <h3 className="text-xl font-bold mb-3 flex items-center">
                    <span className="mr-2">🚀</span>
                    {project.name}
                  </h3>
  
                  <div className="space-y-2 text-gray-300">
                    <div className="flex justify-between">
                      <span>Objectif:</span>
                      <strong>${project.targetAmount.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Économisé:</span>
                      <strong>${project.savedAmount.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Date limite:</span>
                      <strong>
                        {new Date(project.deadline).toLocaleDateString()}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Priorité:</span>
                      <strong className="uppercase text-teal-400">
                        {project.priority}
                      </strong>
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-700">
                      <p className="text-center text-sm">
                        Contribution mensuelle:
                        <span className="block text-lg font-bold text-teal-400">
                          ${(project.monthlyContribution || 0).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
  
                  {/* Menu d'actions (3 points) */}
                  <div className="absolute top-2 right-2">
                    <RecordActions
                      onEdit={() => handleEditProject(project)}
                      onDelete={() => handleOpenModal(project.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* Section de modification du projet (par exemple via un modal ou inline) */}
        {editingProject && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-center mb-4">
              Modifier le projet: {editingProject.name}
            </h2>
            <ProjectUpdateForm 
              initialProject={editingProject} 
              onUpdate={handleUpdateProject}
              onCancel={() => setEditingProject(null)}
            />
          </div>
        )}
      </div>
  
      {/* Modal de confirmation pour la suppression */}
      <Confirmation
        isOpen={isModalOpen}
        title="Confirmation de suppression"
        message="Voulez-vous vraiment supprimer ce projet ?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ProjectPage;
