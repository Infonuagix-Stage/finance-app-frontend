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
import UserDropdown from "./components/UserDropdown";
import Footer from "./components/layouts/Footer";
import "./i18n";
import useSyncAuth0User from "./hooks/useSyncAuth0User";
import "./index.css";
import "./App.css"; // Import the CSS file

interface NavbarProps {
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UserDropdownProps {
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContent: React.FC = () => {
  useSyncAuth0User();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <div id="app-root" className="app-container">
      <Navbar setIsDropdownOpen={setIsDropdownOpen} />
      <UserDropdown isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />

      <div className="main-content">
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

const App: React.FC = () => {
  return (
    <BudgetProvider>
      <Router>
        <AppContent />
      </Router>
    </BudgetProvider>
  );
};

export default App;
