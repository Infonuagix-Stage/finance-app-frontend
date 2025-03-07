// context/BudgetContext.js
import React, { createContext, useState } from "react";

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [globalBalance, setGlobalBalance] = useState(0);

  return (
    <BudgetContext.Provider
      value={{
        totalIncome,
        totalExpense,
        globalBalance,
        setTotalIncome,
        setTotalExpense,
        setGlobalBalance,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudgetContext = () => React.useContext(BudgetContext);
