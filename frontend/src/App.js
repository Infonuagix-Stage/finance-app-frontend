// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Signup";
import Dashboard from "./components/LoadingPage";
import PrivateRoute from "./components/PrivateRoute";
import BudgetingPage from "./components/BudgetingPage";
import CategoryPage from "./components/CategoryPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Register />} />

                    {/* Routes protégées */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/loadingpage" element={<Dashboard />} />
                        <Route path="/budgeting" element={<BudgetingPage />} />
                        {/* On passe l'ID de la catégorie */}
                        <Route path="/category/:categoryName" element={<CategoryPage />} />
                    </Route>

                    {/* Route de fallback */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
