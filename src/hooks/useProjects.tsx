import { useState, useEffect, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  createProjectForUser,
  deleteProjectForUser,
  getProjectsForUser,
  updateProjectForUser,
} from "../services/projectService";

// Define types
interface Project {
  id: string;
  name: string;
  description?: string;
  [key: string]: any; // Allow additional project properties
}

interface ProjectData {
  name: string;
  description?: string;
  [key: string]: any;
}

export const useProjects = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!isAuthenticated || !user?.sub) return;

    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      const fetchedProjects: Project[] = await getProjectsForUser(user.sub, token);
      setProjects(fetchedProjects);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [user?.sub, isAuthenticated, getAccessTokenSilently]);

  const createProject = async (projectData: ProjectData): Promise<Project> => {
    try {
      const token = await getAccessTokenSilently();
      const newProject: Project = await createProjectForUser(user?.sub || "", { ...projectData, description: projectData.description || "" }, token);
      setProjects((prev) => [...prev, newProject]);
      return newProject;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const updateProject = async (projectId: string, projectData: ProjectData): Promise<Project> => {
    try {
      const token = await getAccessTokenSilently();
      const updatedProject: Project = await updateProjectForUser(user?.sub || "", projectId, projectData, token);
      setProjects((prev) => prev.map((project) => (project.id === projectId ? updatedProject : project)));
      return updatedProject;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    try {
      const token = await getAccessTokenSilently();
      await deleteProjectForUser(user?.sub || "", projectId, token);
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

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
