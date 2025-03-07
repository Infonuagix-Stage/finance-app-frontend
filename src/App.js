import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Signup";
import LoadingPage from "./components/LoadingPage";
import PrivateRoute from "./components/PrivateRoute";
import BudgetingPage from "./components/pages/BudgetingPage";
import CategoryPage from "./components/pages/CategoryPage";
import DashboardPage from "./components/pages/Dashboard";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import About from "./components/pages/About";
import ProjectPage from "./components/pages/ProjectPage";
import Navbar from "./components/layouts/Navbar";
import Payment from "./components/Payment";
import { BudgetProvider } from "./context/BudgetContext";
import FinanceHomePage from "./HomePage";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
      <p>&copy; {new Date().getFullYear()} FinanceApp. All rights reserved.</p>
    </footer>
  );
};

const AppContent = () => {
  const { user } = useAuthContext();

  return (
    <div className="pt-16 flex flex-col min-h-screen">
      {user ? <Navbar /> : <Navbar /> /* Another Navbar or none */}
      <div className="flex-grow flex flex-col">
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<FinanceHomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />

          {/* Routes protégées */}
          <Route element={<PrivateRoute />}>
            <Route path="/loadingpage" element={<LoadingPage />} />
            <Route path="/budgeting" element={<BudgetingPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/project" element={<ProjectPage />} />
            <Route path="/payment" element={<Payment />} />
          </Route>

          {/* Route de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
        <Router>
          <AppContent />
        </Router>
      </BudgetProvider>
    </AuthProvider>
  );
}

export default App;
