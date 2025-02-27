import React, { useState, useEffect } from "react";
import {
  getDebtsForUser,
  createDebtForUser,
  updateDebtForUser,
  deleteDebtForUser,
} from "../services/debtService";

const Payment = () => {
  const [debts, setDebts] = useState([]);
  const [isDebtModalVisible, setIsDebtModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDebt, setCurrentDebt] = useState(null);

  // État pour le formulaire
  const [creditor, setCreditor] = useState("");
  const [amountOwed, setAmountOwed] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [status, setStatus] = useState("Pending");

  const userId = 1; // Remplace par l'ID de l'utilisateur connecté

  // Charger les dettes au montage du composant
  useEffect(() => {
    const fetchDebts = async () => {
      try {
        const debtsData = await getDebtsForUser(userId);
        setDebts(debtsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des dettes :", error);
      }
    };

    fetchDebts();
  }, [userId]);

  // Ouvrir le modal pour créer ou modifier une dette
  const openDebtModal = (debt = null) => {
    if (debt) {
      // Mode édition
      setIsEditMode(true);
      setCurrentDebt(debt);
      setCreditor(debt.creditor);
      setAmountOwed(debt.amountOwed);
      setAmountPaid(debt.amountPaid);
      setDueDate(debt.dueDate);
      setMonthlyPayment(debt.monthlyPayment);
      setStatus(debt.status);
    } else {
      // Mode création
      setIsEditMode(false);
      setCurrentDebt(null);
      setCreditor("");
      setAmountOwed(0);
      setAmountPaid(0);
      setDueDate("");
      setMonthlyPayment(0);
      setStatus("Pending");
    }
    setIsDebtModalVisible(true);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const debtData = {
      creditor,
      amountOwed,
      amountPaid,
      dueDate,
      monthlyPayment,
      status,
    };

    try {
      if (isEditMode) {
        // Mettre à jour la dette existante
        const updatedDebt = await updateDebtForUser(
          userId,
          currentDebt.id,
          debtData
        );
        setDebts(
          debts.map((debt) => (debt.id === updatedDebt.id ? updatedDebt : debt))
        );
      } else {
        // Créer une nouvelle dette
        const createdDebt = await createDebtForUser(userId, debtData);
        setDebts([...debts, createdDebt]);
      }
      setIsDebtModalVisible(false);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
    }
  };

  // Supprimer une dette
  const handleDeleteDebt = async (id) => {
    try {
      await deleteDebtForUser(userId, id);
      setDebts(debts.filter((debt) => debt.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de la dette :", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-6 py-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-6">
          Gestion des Dettes
        </h1>
      </div>

      {/* Section Dettes */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-8">
          Dettes
        </h2>
        <div className="space-y-6">
          {debts.length === 0 ? (
            <p className="text-gray-400 text-center">Aucune dette ajoutée.</p>
          ) : (
            debts.map((debt) => (
              <div
                key={debt.id}
                className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-lg border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
              >
                <h4 className="text-xl font-semibold">{debt.creditor}</h4>
                <p className="text-sm text-gray-300 mt-2">
                  Montant total : ${debt.amountOwed.toFixed(2)}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  Montant restant : $
                  {(debt.amountOwed - debt.amountPaid).toFixed(2)}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  Progression :{" "}
                  <span className="font-bold">
                    {((debt.amountPaid / debt.amountOwed) * 100).toFixed(2)}%
                  </span>
                </p>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => openDebtModal(debt)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white rounded-lg transition-all duration-200"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteDebt(debt.id)}
                    className="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-lg transition-all duration-200"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          )}
          {/* Bouton pour ouvrir le modal d'ajout */}
          <button
            onClick={() => openDebtModal()}
            className="w-full flex items-center justify-center py-6 bg-gradient-to-br from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-gray-100 rounded-2xl shadow-lg border border-gray-600/50 transition-all duration-300 hover:scale-105"
          >
            <span className="text-4xl font-bold">+</span>
          </button>
        </div>
      </div>

      {/* Modal pour créer ou modifier une dette */}
      {isDebtModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 w-96 border border-gray-700/50">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-6">
              {isEditMode ? "Modifier une Dette" : "Ajouter une Dette"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Créancier"
                value={creditor}
                onChange={(e) => setCreditor(e.target.value)}
                className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                required
              />
              <input
                type="number"
                placeholder="Montant total"
                value={amountOwed}
                onChange={(e) => setAmountOwed(Number(e.target.value))}
                className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                required
              />
              <input
                type="number"
                placeholder="Montant déjà payé"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                required
              />
              <input
                type="date"
                placeholder="Date d'échéance"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                required
              />
              <input
                type="number"
                placeholder="Paiement mensuel"
                value={monthlyPayment}
                onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                required
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                required
              >
                <option value="Pending">En attente</option>
                <option value="Paid">Payé</option>
                <option value="Overdue">En retard</option>
              </select>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsDebtModalVisible(false)}
                  className="px-6 py-2 bg-gray-600/50 hover:bg-gray-500/50 text-white rounded-lg transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white rounded-lg transition-all duration-200"
                >
                  {isEditMode ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
