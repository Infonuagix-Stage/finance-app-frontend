// services/categoryService.js
import axios from "axios";

// This function fetches categories for a specific user.
// Replace userId with a dynamic value if needed.
export const getCategoriesForUser = async (userId) => {
  // Retrieve the token from localStorage
  const yourJwtToken = localStorage.getItem("token");
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  // Make the request with the Authorization header
  const response = await axios.get(`http://localhost:8080/api/v1/users/${userId}/categories`, {
    headers: {
      Authorization: `Bearer ${yourJwtToken}`,
    },
  });

  return response.data; // Return the categories array
};

export const createCategoryForUser = async (userId, categoryName) => {
  const yourJwtToken = localStorage.getItem("token");
  console.log("Token envoyé dans l'en-tête Authorization :", yourJwtToken);

  const response = await axios.post(
    `http://localhost:8080/api/v1/users/${userId}/categories`,
    {
      name: categoryName,
      description: `Description for ${categoryName}`,
    },
    {
      headers: {
        Authorization: `Bearer ${yourJwtToken}`,
      },
    }
  );

  return response.data; // Return the newly created category
};