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

/**
 * Récupère toutes les dettes d'un utilisateur.
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<Array>} - Une liste de dettes.
 */
export const getDebtsForUser = async (userId) => {
  const yourJwtToken = localStorage.getItem("token");
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await api.get(`/users/${userId}/debts`, {
    headers: {
      Authorization: `Bearer ${yourJwtToken}`,
    },
  });

  return response.data;
};

/**
 * Crée une nouvelle dette pour un utilisateur.
 * @param {number} userId - L'ID de l'utilisateur.
 * @param {Object} debtData - Les données de la dette à créer.
 * @returns {Promise<Object>} - La dette créée.
 */
export const createDebtForUser = async (userId, debtData) => {
  const yourJwtToken = localStorage.getItem("token");
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await api.post(`/users/${userId}/debts`, debtData, {
    headers: {
      Authorization: `Bearer ${yourJwtToken}`,
    },
  });

  return response.data;
};

/**
 * Met à jour une dette existante.
 * @param {number} userId - L'ID de l'utilisateur.
 * @param {number} id - L'ID de la dette à mettre à jour.
 * @param {Object} updatedData - Les nouvelles données de la dette.
 * @returns {Promise<Object>} - La dette mise à jour.
 */
export const updateDebtForUser = async (userId, id, updatedData) => {
  const yourJwtToken = localStorage.getItem("token");
  console.log("Données envoyées au PUT (updateDebtForUser):", updatedData);
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await api.put(`/users/${userId}/debts/${id}`, updatedData, {
    headers: {
      Authorization: `Bearer ${yourJwtToken}`,
    },
  });

  return response.data;
};

/**
 * Supprime une dette.
 * @param {number} userId - L'ID de l'utilisateur.
 * @param {number} id - L'ID de la dette à supprimer.
 * @returns {Promise<Object>} - La réponse de l'API.
 */
export const deleteDebtForUser = async (userId, id) => {
  const yourJwtToken = localStorage.getItem("token");
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await api.delete(`/users/${userId}/debts/${id}`, {
    headers: {
      Authorization: `Bearer ${yourJwtToken}`,
    },
  });

  return response.data;
};
