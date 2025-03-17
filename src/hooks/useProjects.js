import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  createProjectForUser,
  deleteProjectForUser,
  getProjectsForUser,
  updateProjectForUser,
} from "../services/projectService";

export const useProjects = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0(); // Use Auth0
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);

  
  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    setLoading(true);
    try {
      const token = await getAccessTokenSilently(); 
      const fetchedProjects = await getProjectsForUser(user.sub, token); 
      setProjects(fetchedProjects);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, getAccessTokenSilently]);

  const createProject = async (projectData) => {
    try {
      const token = await getAccessTokenSilently();
      const newProject = await createProjectForUser(user.sub, projectData, token);
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateProject = async (projectId, projectData) => {
    try {
      const token = await getAccessTokenSilently();
      const updatedProject = await updateProjectForUser(user.sub, projectId, projectData, token);
      setProjects((prev) =>
        prev.map((project) => (project.id === projectId ? updatedProject : project))
      );
      return updatedProject;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const token = await getAccessTokenSilently();
      await deleteProjectForUser(user.sub, projectId, token);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Load projects on component mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [fetchProjects, isAuthenticated]);

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
