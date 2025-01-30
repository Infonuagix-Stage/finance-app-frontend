import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import axios from "axios";
import {
    createCategoryForUser
  } from "../services/categoryService";

const BudgetingPage = () => {
    const userId = 1; // Replace with the actual logged-in user ID
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");

    // Fetch categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/users/${userId}/categories`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Ajoutez ici le token JWT
                    },
                });
                console.log("Catégories récupérées :", response.data); // Ajoutez ce log
                setCategories(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories :", error.response || error.message);
            }
        };
        fetchCategories();
    }, [userId]);

    // Add a new category
    const addCategory = async () => {
        if (newCategory.trim() === "") return;
    
        try {
          const created = await createCategoryForUser(userId, newCategory);
          // Add the new category to the existing array in state
          setCategories([...categories, created]);
          setNewCategory("");
        } catch (error) {
          console.error("Error adding category:", error);
        }
      };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-8">
            <h1 className="text-3xl font-bold mb-6">Budgeting Categories</h1>

            {/* Add Category Section */}
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

            {/* Display Categories */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/category/${category.name}`}
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
