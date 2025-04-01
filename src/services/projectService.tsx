import axios from "axios";

// Define Project Interface (Adjust fields based on actual API response)
export interface Project {
  id: string;
  name: string;
  description: string;
  savedAmount?: number; // ✅ Optional to prevent errors
  targetAmount?: number; // ✅ Optional to prevent errors
  priority?: string; // ✅ Optional to prevent errors
  createdAt?: string;
  updatedAt?: string;
}


// Axios instance with base URL
const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Get projects for a user
export const getProjectsForUser = async (
  userId: string,
  token: string
): Promise<Project[]> => {
  const response = await api.get<Project[]>(`users/${userId}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Create a new project for a user
export const createProjectForUser = async (
  userId: string,
  projectData: Omit<Project, "id">, // Exclude id when creating a new project
  token: string
): Promise<Project> => {
  const response = await api.post<Project>(
    `/users/${userId}/projects`,
    projectData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

// Delete a project for a user
export const deleteProjectForUser = async (
  userId: string,
  projectId: string,
  token: string
): Promise<void> => {
  await api.delete(`/users/${userId}/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Update an existing project
export const updateProjectForUser = async (
  userId: string,
  projectId: string,
  updatedData: Partial<Omit<Project, "id">>, // Allow partial updates
  token: string
): Promise<Project> => {
  const response = await api.put<Project>(
    `/users/${userId}/projects/${projectId}`,
    updatedData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
