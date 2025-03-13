import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Signup";
import LoadingPage from "./components/LoadingPage";
import PrivateRoute from "./components/PrivateRoute";
import BudgetingPage from "./components/pages/BudgetingPage";
import CategoryPage from "./components/pages/CategoryPage";
import DashboardPage from "./components/pages/Dashboard";
import About from "./components/pages/About";
import ProjectPage from "./components/pages/ProjectPage";
import Navbar from "./components/layouts/Navbar";
import Payment from "./components/Payment";
import { BudgetProvider } from "./context/BudgetContext";
import FinanceHomePage from "./HomePage";
import Footer from "./components/layouts/Footer";
import "./i18n";
import useSyncAuth0User  from "./hooks/useSyncAuth0User";
const AppContent = () => {
  useSyncAuth0User();
  return (
    <div className="pt-16 flex flex-col min-h-screen">
      <Navbar /> {/* Always show Navbar */}
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
