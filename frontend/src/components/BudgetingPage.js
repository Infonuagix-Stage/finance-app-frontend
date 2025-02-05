// BudgetingPage.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { createCategoryForUser } from "../services/categoryService";
import { useAuthContext } from "../context/AuthContext";

const BudgetingPage = () => {
  const { user, token } = useAuthContext();
  const userId = user ? user.id : null;

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  // État pour stocker les totaux des dépenses par catégorie :
  const [categoryTotals, setCategoryTotals] = useState({});
  const totalGlobalCategories = categories.reduce(
    (acc, category) => acc + Number(categoryTotals[category.id] || 0),
    0
  );

  // Récupérer les catégories depuis le backend
  useEffect(() => {
    if (!userId) return;
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://financeapp-env-1.eba-rx23r9ye.us-east-1.elasticbeanstalk.com/api/v1/users/${userId}/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Catégories récupérées :", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des catégories :",
          error.response || error.message
        );
      }
    };
    fetchCategories();
  }, [userId, token]);

  // Une fois les catégories récupérées, lancer la récupération des totaux pour chaque catégorie
  useEffect(() => {
    if (!userId || categories.length === 0) return;

    const fetchTotals = async () => {
      const totals = {};
      // Utilise Promise.all pour exécuter tous les appels en parallèle
      await Promise.all(
        categories.map(async (category) => {
          try {
            const response = await axios.get(
              `http://financeapp-env-1.eba-rx23r9ye.us-east-1.elasticbeanstalk.com/api/v1/users/${userId}/categories/${category.id}/expenses/total`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            // Supposons que l'API renvoie directement un nombre ou une chaîne
            totals[category.id] = response.data;
          } catch (error) {
            console.error(
              "Erreur lors de la récupération du total pour la catégorie",
              category.id,
              error
            );
            totals[category.id] = 0;
          }
        })
      );
      setCategoryTotals(totals);
    };

    fetchTotals();
  }, [userId, categories, token]);

  // Ajout d'une nouvelle catégorie
  const addCategory = async () => {
    if (newCategory.trim() === "") return;
    if (!userId) {
      console.error(
        "L'ID utilisateur est indéfini. Impossible d'ajouter une catégorie."
      );
      return;
    }

    try {
      const created = await createCategoryForUser(userId, newCategory);
      // On ajoute la nouvelle catégorie et on met à jour l'état
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

      {/* Affichage des catégories avec le total de chaque catégorie */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              // On construit l'URL avec le nom de la catégorie encodé
              to={`/category/${encodeURIComponent(category.name)}`}
              // On peut également transmettre le nom dans le state
              state={{ categoryName: category.name, categoryId: category.id }}
              className="block p-6 bg-gray-800 rounded-lg shadow hover:bg-gray-700 transition"
            >
              <h3 className="text-lg font-semibold text-white">
                {category.name}
              </h3>
              <p className="text-gray-400 text-sm">{category.description}</p>
              <p className="text-white mt-2">
                Total : $
                {categoryTotals[category.id] !== undefined
                  ? Number(categoryTotals[category.id]).toFixed(2)
                  : "0.00"}
              </p>
            </Link>
          ))}
        </div>
      </div>
      {/* Div pour afficher le total global de toutes les catégories */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Total Global de toutes les catégories : $
          {totalGlobalCategories.toFixed(2)}
        </h1>
      </div>
    </div>
  );
};

export default BudgetingPage;
