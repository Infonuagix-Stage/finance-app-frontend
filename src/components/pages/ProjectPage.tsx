import React, { useState } from "react";
import ProjectForm from "../features/Project/ProjectForm";
import ProjectUpdateForm from "../features/Project/ProjectUpdateForm";
import ProjectCard from "../features/Project/ProjectCard";
import Confirmation from "../Confirmation";
import { useProjects } from "../../hooks/useProjects";
import { calculateMonthlyContribution } from "../../utils/projectCalculations";
import { useTranslation } from "react-i18next";
import styles from "./ProjectPage.module.css";

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const { t } = useTranslation("project");

  const handleCreateProject = async (projectData: Project) => {
    if (!projectData.name) return;

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
    <div className={styles.projectContainer}>
      <div className={styles.maxContainer}>
        <h1 className={styles.title}>{t("myFinancialProjects")}</h1>

        <div className={styles.createProjectContainer}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loader}></div>
            </div>
          ) : (
            <ProjectForm
              onCreate={(project) => handleCreateProject(project).catch(console.error)}
            />
          )}
        </div>

        <div className={styles.projectsList}>
          <h2 className={styles.projectsTitle}>{t("ongoingProjects")}</h2>

          {projects.length === 0 ? (
            <div className={styles.noProjects}>
              <p className={styles.noProjectsText}>{t("noProjectsAdded")}</p>
            </div>
          ) : (
            <div className={styles.projectsGrid}>
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
          <div className={styles.updateModal}>
            <div className={styles.updateFormContainer}>
              <button
                onClick={() => setCurrentProject(null)}
                className={styles.closeButton}
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
                onUpdate={(updatedProject) =>
                  handleUpdateProject(updatedProject).catch(console.error)
                }
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
