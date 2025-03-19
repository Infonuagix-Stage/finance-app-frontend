import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Payment = () => {
  const { t } = useTranslation("payement");
  const [debts, setDebts] = useState([]);
  const [newDebtName, setNewDebtName] = useState("");
  const [newDebtTotalAmount, setNewDebtTotalAmount] = useState(0);
  const [isDebtModalVisible, setIsDebtModalVisible] = useState(false);

  const addDebt = () => {
    const newDebt = {
      id: Date.now(),
      name: newDebtName,
      totalAmount: newDebtTotalAmount,
      remainingAmount: newDebtTotalAmount // Au début, le montant restant est égal au montant total
    };
    setDebts([...debts, newDebt]);
    setIsDebtModalVisible(false);
    setNewDebtName("");
    setNewDebtTotalAmount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 px-6 py-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
        <h1 className="text-5xl font-extrabold text-center bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-6">
          {t("title")}
        </h1>
      </div>

      {/* Section des dettes */}
      <div className="max-w-6xl mx-auto mt-12">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-8">
          {t("debt")}
        </h2>
        <div className="space-y-6">
          {debts.length === 0 ? (
            <p className="text-gray-400 text-center">{t("noDebt")}</p>
          ) : (
            debts.map((debt) => (
              <div
                key={debt.id}
                className="p-6 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-lg border border-gray-700/50 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
              >
                <h4 className="text-xl font-semibold">{debt.name}</h4>
                <p className="text-sm text-gray-300 mt-2">
                  {t("totalAmount")} : ${debt.totalAmount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  {t("remainingAmount")} : ${debt.remainingAmount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  {t("progress")} :{" "}
                  <span className="font-bold">
                    {((1 - debt.remainingAmount / debt.totalAmount) * 100).toFixed(2)}%
                  </span>
                </p>
              </div>
            ))
          )}
          {/* Bouton pour ouvrir le modal d'ajout */}
          <button
            onClick={() => setIsDebtModalVisible(true)}
            className="w-full flex items-center justify-center py-6 bg-gradient-to-br from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-gray-100 rounded-2xl shadow-lg border border-gray-600/50 transition-all duration-300 hover:scale-105"
          >
            <span className="text-4xl font-bold">+</span>
          </button>
        </div>
      </div>

      {/* Modal d'ajout de dette */}
      {isDebtModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl p-8 w-96 border border-gray-700/50">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent mb-6">
              {t("addDebt")}
            </h3>
            <input
              type="text"
              placeholder={t("debtNamePlaceholder")}
              value={newDebtName}
              onChange={(e) => setNewDebtName(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
            <input
              type="number"
              placeholder={t("totalAmountPlaceholder")}
              value={newDebtTotalAmount}
              onChange={(e) => setNewDebtTotalAmount(Number(e.target.value))}
              className="w-full mb-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDebtModalVisible(false)}
                className="px-6 py-2 bg-gray-600/50 hover:bg-gray-500/50 text-white rounded-lg transition-all duration-200"
              >
                {t("cancel")}
              </button>
              <button
                onClick={addDebt}
                className="px-6 py-2 bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white rounded-lg transition-all duration-200"
              >
                {t("add")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
