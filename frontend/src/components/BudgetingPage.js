// BudgetingPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { createCategoryForUser } from "../services/categoryService";
import { useAuthContext } from "../context/AuthContext";

const BudgetingPage = () => {
  // Récupération du contexte d'authentification
  const { user, token } = useAuthContext();

  // Vérifier que l'utilisateur est défini
  const userId = user ? user.id : null;

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  // Fetch categories depuis le backend
  useEffect(() => {
    if (!userId) return; // Ne rien faire si l'utilisateur n'est pas identifié

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/users/${userId}/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Utilisation du token du contexte
            },
          }
        );
        console.log("Catégories récupérées :", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error.response || error.message);
      }
    };
    fetchCategories();
  }, [userId, token]);

  // Ajout d'une nouvelle catégorie
  const addCategory = async () => {
    if (newCategory.trim() === "") return;
    if (!userId) {
      console.error("L'ID utilisateur est indéfini. Impossible d'ajouter une catégorie.");
      return;
    }
  
    try {
      const created = await createCategoryForUser(userId, newCategory);
      setCategories([...categories, created]);
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  if (!user) {
    return <p>Chargement ou redirection...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-6">Budgeting Categories</h1>

      {/* Section d'ajout de catégorie */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-gray-200 mb-4"
        />
        <button
          onClick={addCategory}
          className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      {/* Affichage des catégories */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="block p-6 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition"
            >
              <h3 className="text-lg font-semibold text-white">{category.name}</h3>
              <p className="text-gray-400 text-sm">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetingPage;
