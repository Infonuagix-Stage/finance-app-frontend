// categoryService.js
import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Ajout de l'intercepteur pour le token si nécessaire
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getProjectsForUser = async (userId) => {
  // Retrieve the token from localStorage
  const yourJwtToken = localStorage.getItem("token");
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);


  // Make the request with the Authorization header
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/${userId}/projects`,
    {
      headers: {
        Authorization: `Bearer ${yourJwtToken}`,
      },
    }
  );

  return response.data;
};

export const createProjectForUser = async (userId, ProjectData) => {
  const yourJwtToken = localStorage.getItem("token");
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await api.post(`/users/${userId}/projects`, ProjectData, {
    headers: {
      Authorization: `Bearer ${yourJwtToken}`,
    },
  });

  return response.data;
};

export const deleteProjectForUser = async (userId, projectId) => {
  const yourJwtToken = localStorage.getItem("token");

  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await api.delete(`/users/${userId}/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${yourJwtToken}`,
    },
  });

  return response.data;
};

export const updateProjectForUser = async (userId, projectId, updatedData) => {
  const yourJwtToken = localStorage.getItem("token");
  console.log("Données envoyées au PUT (updateProjectForUser):", updatedData);
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await api.put(
    `/users/${userId}/projects/${projectId}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${yourJwtToken}`,
      },
    }
  );
  console.log("Données envoyées au PUT (updateProjectForUser):", updatedData);
  return response.data;
};
