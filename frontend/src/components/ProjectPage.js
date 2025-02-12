import React, { useEffect, useState } from "react";
import ProjectForm from "./ProjectForm";
import { useAuthContext } from "../context/AuthContext";
import { getProjectsForUser, createProjectForUser, deleteProjectForUser } from "../services/projectService";
import Confirmation from './Confirmation'; // chemin d'accès à adapter


const ProjectPage = () => {
  const { user, token } = useAuthContext(); // Get user & token
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);


  const handleOpenModal = (id) => {
    setSelectedProjectId(id);
    setIsModalOpen(true);
  };

  // Ferme le modal sans suppression
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
      // On envoie uniquement les données du projet
      const createdProject = await createProjectForUser(user.id, newProject);
      setProjects([...projects, createdProject]);
    } catch (error) {
      console.log("Erreur lors de la création du projet: ", error);
    }
  };
  

  useEffect(() => {
    if (!user) {
      // Si aucun utilisateur, on arrête la logique de récupération
      setLoading(false);
      return;
    }
    
    const fetchProjects = async () => {
      try {
        // On utilise user.id pour récupérer les projets
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
  
        {/* Project Creation Section */}
        <div className="mb-20 backdrop-blur-sm bg-gray-800/30 rounded-xl p-8 shadow-xl border border-gray-700/50">
          {loading ? (
            <div className="animate-pulse flex justify-center items-center h-32">
              <div className="w-12 h-12 rounded-full border-4 border-gray-600 border-t-teal-500 animate-spin"></div>
            </div>
          ) : (
            <ProjectForm onCreate={addProject} />
          )}
        </div>
  
        {/* Projects List */}
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
                  {/* Progress Bar */}
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
                      <strong>${project.targetAmount}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Économisé:</span>
                      <strong>${project.savedAmount}</strong>
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
  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleOpenModal(project.id)}
                    className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-500 hover:bg-red-600 p-2 rounded-full shadow-lg"
                    title="Supprimer"
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  
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
