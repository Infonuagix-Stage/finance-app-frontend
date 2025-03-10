import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";
import {
  createProjectForUser,
  deleteProjectForUser,
  getProjectsForUser,
  updateProjectForUser,
} from "../services/projectService";

export const useProjects = () => {
  const { user, token } = useAuthContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);

  const fetchProjects = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const fetchedProjects = await getProjectsForUser(user.userId, token);
      setProjects(fetchedProjects);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user, token]);

  const createProject = async (projectData) => {
    try {
      const newProject = await createProjectForUser(user.userId, projectData);
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateProject = async (projectId, projectData) => {
    try {
      const updatedProject = await updateProjectForUser(
        user.id,
        projectId,
        projectData
      );
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId ? updatedProject : project
        )
      );
      return updatedProject;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      await deleteProjectForUser(user.userId, projectId);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    currentProject,
    setCurrentProject,
  };
};
