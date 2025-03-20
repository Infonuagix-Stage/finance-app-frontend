// App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Signup";
import LoadingPage from "./components/LoadingPage";
import PrivateRoute from "./components/PrivateRoute";
import BudgetingPage from "./components/pages/BudgetingPage";
import CategoryPage from "./components/pages/CategoryPage";
import DashboardPage from "./components/pages/Dashboard";
import ProfilePage from "./components/pages/ProfilePage";
import SettingsPage from "./components/pages/SettingsPage";
import About from "./components/pages/About";
import ProjectPage from "./components/pages/ProjectPage";
import Navbar from "./components/layouts/Navbar";
import Payment from "./components/Payment";
import { BudgetProvider } from "./context/BudgetContext";
import FinanceHomePage from "./HomePage";
import UserDropdown from "./components/UserDropdown"; // Assurez-vous que le chemin est correct

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
      <p>&copy; {new Date().getFullYear()} FinanceApp. Tous droits réservés.</p>
    </footer>
  );
};

const AppContent = () => {
  // On gère l'ouverture/fermeture du dropdown ici
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    // Le conteneur principal doit être en position relative pour que
    // le UserDropdown (en absolute) puisse se positionner par rapport à lui
    <div
      id="app-root"
      className="relative pt-16 flex flex-col min-h-screen overflow-x-hidden"
    >
      <Navbar setIsDropdownOpen={setIsDropdownOpen} />
      {/* Le menu latéral est rendu ici, et il occupe la hauteur totale du contenu */}
      <UserDropdown
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />
      <div className="flex-grow flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<FinanceHomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/about" element={<About />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/loadingpage" element={<LoadingPage />} />
            <Route path="/budgeting" element={<BudgetingPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/project" element={<ProjectPage />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <BudgetProvider>
      <Router>
        <AppContent />
      </Router>
    </BudgetProvider>
  );
}

export default App;
