// categoryService.js
import axios from "axios";
const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});


export const getProjectsForUser = async (userId, token) => {
  //console.log("Token envoyé dans l'en-tête Authorization :", token);
  //console.log("userId envoyé dans l'URL :", userId);
  
  const response = await api.get(`users/${userId}/projects`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createProjectForUser = async (userId, ProjectData, token) => {
  //const yourJwtToken = localStorage.getItem("token");
  //console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await api.post(`/users/${userId}/projects`, 
    ProjectData, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteProjectForUser = async (userId, projectId, token) => {
  const response = await api.delete(`/users/${userId}/projects/${projectId}`, 
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProjectForUser = async (userId, projectId, updatedData, token) => {
  const response = await api.put(
    `/users/${userId}/projects/${projectId}`,
    updatedData,
    { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};