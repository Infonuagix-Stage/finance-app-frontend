import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context state
interface BudgetContextType {
  totalIncome: number;
  totalExpense: number;
  globalBalance: number;
  setTotalIncome: React.Dispatch<React.SetStateAction<number>>;
  setTotalExpense: React.Dispatch<React.SetStateAction<number>>;
  setGlobalBalance: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context with an initial undefined value
const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Define props for the provider
interface BudgetProviderProps {
  children: ReactNode;
}

export const BudgetProvider: React.FC<BudgetProviderProps> = ({ children }) => {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [globalBalance, setGlobalBalance] = useState<number>(0);

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

// Custom hook to use the budget context
export const useBudgetContext = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudgetContext must be used within a BudgetProvider");
  }
  return context;
};
