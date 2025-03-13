// // hooks/useProjectService.js
// import useAxiosAuth from "../hooks/useAxiosAuth";

// const useProjectService = () => {
//   const api = useAxiosAuth();

//   const getProjectsForUser = async (userId) => {
//     const response = await api.get(`/users/${userId}/projects`);
//     return response.data;
//   };

//   const createProjectForUser = async (userId, projectData) => {
//     const response = await api.post(`/users/${userId}/projects`, projectData);
//     return response.data;
//   };

//   const deleteProjectForUser = async (userId, projectId) => {
//     const response = await api.delete(`/users/${userId}/projects/${projectId}`);
//     return response.data;
//   };

//   const updateProjectForUser = async (userId, projectId, updatedData) => {
//     const response = await api.put(
//       `/users/${userId}/projects/${projectId}`,
//       updatedData
//     );
//     return response.data;
//   };

//   return {
//     getProjectsForUser,
//     createProjectForUser,
//     deleteProjectForUser,
//     updateProjectForUser,
//   };
// };

// export default useProjectService;



// categoryService.js
import axios from "axios";
const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});


export const getProjectsForUser = async (userId, token) => {
  // Retrieve the token from localStorage
  //const yourJwtToken = localStorage.getItem("token");
   //console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  // Make the request with the Authorization header
  console.log("Token envoyé dans l'en-tête Authorization :", token);
  console.log("userId envoyé dans l'URL :", userId);
  const response = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/${userId}/projects`,
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

  const response = await api.post(`/users/${encodeURIComponent(userId)}/projects`, ProjectData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteProjectForUser = async (userId, projectId, token) => {
  //const yourJwtToken = localStorage.getItem("token");

  //console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await api.delete(`/users/${encodeURIComponent(userId)}/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProjectForUser = async (userId, projectId, updatedData, token) => {
  //const yourJwtToken = localStorage.getItem("token");
  //console.log("Données envoyées au PUT (updateProjectForUser):", updatedData);
  //console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await api.put(
    `/users/${encodeURIComponent(userId)}/projects/${projectId}`,
    updatedData,
    { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("Données envoyées au PUT (updateProjectForUser):", updatedData);
  return response.data;
};