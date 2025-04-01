import React, { useState } from "react";
import ProjectForm from "../features/Project/ProjectForm";
import ProjectUpdateForm from "../features/Project/ProjectUpdateForm";
import ProjectCard from "../features/Project/ProjectCard";
import Confirmation from "../Confirmation";
import { useProjects } from "../../hooks/useProjects";
import { calculateMonthlyContribution } from "../../utils/projectCalculations";
import { useTranslation } from "react-i18next";
import './ProjectPage.css';

// Type Definitions
interface Project {
  projectId?: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  priority?: string;
  [key: string]: any;
}

const ProjectPage: React.FC = () => {
  const {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    currentProject,
    setCurrentProject,
  } = useProjects();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { t } = useTranslation("project");

  const handleCreateProject = async (projectData: Project) => {
    if (!projectData.name) {
      console.error("Project name is required!");
      return;
    }

    const newProjectId = projectData.projectId || crypto.randomUUID();

    const monthlyContribution = calculateMonthlyContribution(
      projectData.targetAmount,
      projectData.savedAmount,
      projectData.deadline
    );

    await createProject({
      ...projectData,
      projectId: newProjectId,
      monthlyContribution,
    });
  };

  const handleUpdateProject = async (updatedData: Project) => {
    if (!currentProject) return;

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

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      await deleteProject(projectToDelete);
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="project-container">
      <div className="max-container">
        <h1 className="title">{t("myFinancialProjects")}</h1>

        <div className="create-project-container">
          {loading ? (
            <div className="loading">
              <div className="loader"></div>
            </div>
          ) : (
            <ProjectForm
              onCreate={(project) => {
                handleCreateProject(project).catch(console.error);
              }}
            />
          )}
        </div>

        <div className="projects-list">
          <h2 className="projects-title">{t("ongoingProjects")}</h2>

          {projects.length === 0 ? (
            <div className="no-projects">
              <p className="no-projects-text">{t("noProjectsAdded")}</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project.projectId}
                  project={{
                    ...project,
                    savedAmount: project.savedAmount || 0,
                    targetAmount: project.targetAmount || 0,
                    deadline: project.deadline || "",
                    priority: project.priority || "low",
                  }}
                  onEdit={() => setCurrentProject(project)}
                  onDelete={() => handleDeleteClick(project.projectId)}
                />
              ))}
            </div>
          )}
        </div>

        {currentProject && (
          <div className="update-modal">
            <div className="update-form-container">
              <button
                onClick={() => setCurrentProject(null)}
                className="close-button"
              >
                ✕
              </button>
              <ProjectUpdateForm
                initialProject={{
                  ...currentProject,
                  targetAmount: currentProject.targetAmount || 0,
                  savedAmount: currentProject.savedAmount || 0,
                  deadline: currentProject.deadline || "",
                  priority: currentProject.priority || "low",
                }}
                onUpdate={(updatedProject) => {
                  handleUpdateProject(updatedProject).catch(console.error);
                }}
              />
            </div>
          </div>
        )}

        <Confirmation
          isOpen={isDeleteModalOpen}
          title={t("deleteConfirmation")}
          message={t("deleteMessage")}
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
