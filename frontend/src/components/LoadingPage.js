import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LoadingPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(2); // Timer for redirection

  // Handle logout functionality
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Countdown and redirect logic
  useEffect(() => {
    console.log("okok");
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1); // Decrement countdown by 1 every second
    }, 300);

    // Redirect to `/budgeting` when countdown reaches 0
    if (countdown === 0) {
      navigate("/dashboard");
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
      <h2 className="text-3xl font-bold mb-4">Welcome to the loading page</h2>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>
      <p className="mt-6 text-lg text-gray-300">
        You will be redirected to the budgeting page in{" "}
        <span className="text-blue-400 font-bold">{countdown}</span> seconds.
      </p>
    </div>
  );
};

export default LoadingPage;
