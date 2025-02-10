// App.js
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
import DashboardPage from "./components/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { BudgetProvider } from "./context/BudgetContext";

function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
        <Router>
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />

            {/* Routes protégées */}
            <Route element={<PrivateRoute />}>
              <Route path="/loadingpage" element={<Dashboard />} />
              <Route path="/budgeting" element={<BudgetingPage />} />
              <Route
                path="/category/:categoryName"
                element={<CategoryPage />}
              />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* Route de fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </BudgetProvider>
    </AuthProvider>
  );
}

export default App;
