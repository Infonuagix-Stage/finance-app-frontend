import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Signup";
import Dashboard from "./components/LoadingPage";
import PrivateRoute from "./components/PrivateRoute";
import BudgetingPage from "./components/BudgetingPage";
import CategoryPage from "./components/CategoryPage";
import DashboardPage from "./components/Dashboard/Dashboard";
import { AuthProvider, useAuthContext } from "./context/AuthContext";
import About from "./components/About";
import ProjectPage from "./components/ProjectPage";
import Navbar from "./components/Navbar";
import Payment from "./components/Payment";
import { BudgetProvider } from "./context/BudgetContext";

const AppContent = () => {
  const { user } = useAuthContext(); // Vérifie si l'utilisateur est connecté

  return (
    <div className="pt-16">
      {user && <Navbar />}
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        {/* Routes protégées */}
        <Route element={<PrivateRoute />}>
          <Route path="/loadingpage" element={<Dashboard />} />
          <Route path="/budgeting" element={<BudgetingPage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/payment" element={<Payment />} />
        </Route>

        {/* Route de fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
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
