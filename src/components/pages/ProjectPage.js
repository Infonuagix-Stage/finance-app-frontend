import React, { useState } from "react";
import ProjectForm from "../features/Project/ProjectForm";
import ProjectUpdateForm from "../features/Project/ProjectUpdateForm";
import ProjectCard from "../features/Project/ProjectCard";
import Confirmation from "../Confirmation";
import { useProjects } from "../../hooks/useProjects";
import { calculateMonthlyContribution } from "../../utils/projectCalculations";

const ProjectPage = () => {
  const {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    currentProject,
    setCurrentProject,
  } = useProjects();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleCreateProject = async (projectData) => {
    const monthlyContribution = calculateMonthlyContribution(
      projectData.targetAmount,
      projectData.savedAmount,
      projectData.deadline
    );

    await createProject({
      ...projectData,
      monthlyContribution,
    });
  };

  const handleUpdateProject = async (updatedData) => {
    const monthlyContribution = calculateMonthlyContribution(
      updatedData.targetAmount,
      updatedData.savedAmount,
      updatedData.deadline
    );

    await updateProject(currentProject.projectId, {
      ...updatedData,
      monthlyContribution,
    });

    setCurrentProject(null);
  };

  const handleDeleteClick = (projectId) => {
    setProjectToDelete(projectId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteProject(projectToDelete);
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          Mes Projets Financiers
        </h1>

        {/* Project Creation Section */}
        <div className="mb-20">
          {loading ? (
            <div className="animate-pulse flex justify-center items-center h-32">
              <div className="w-12 h-12 rounded-full border-4 border-gray-600 border-t-teal-500 animate-spin"></div>
            </div>
          ) : (
            <ProjectForm onCreate={handleCreateProject} />
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
                <ProjectCard
                  key={project.projectId}
                  project={project}
                  onEdit={() => setCurrentProject(project)}
                  onDelete={() => handleDeleteClick(project.projectId)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Project Update Modal */}
        {currentProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg relative">
              <button
                onClick={() => setCurrentProject(null)}
                className="absolute top-2 right-2 text-gray-300 hover:text-white"
              >
                ✕
              </button>
              <ProjectUpdateForm
                initialProject={currentProject}
                onUpdate={handleUpdateProject}
                onCancel={() => setCurrentProject(null)}
              />
            </div>
          </div>
        )}

        {/* Confirmation Modal for Delete */}
        <Confirmation
          isOpen={isDeleteModalOpen}
          title="Confirmation de suppression"
          message="Voulez-vous vraiment supprimer ce projet ?"
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setProjectToDelete(null);
          }}
        />
      </div>
    </div>
  );
};

export default ProjectPage;
