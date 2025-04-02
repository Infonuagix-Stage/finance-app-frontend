import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./LoadingPage.css"; // Import the CSS file

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth0();
  const [countdown, setCountdown] = useState<number>(2);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 300);

    if (countdown === 0) {
      navigate("/budgeting");
    }

    return () => clearInterval(interval);
  }, [countdown, navigate]);

  return (
    <div className="loading-container">
      <h2 className="loading-title">Welcome to the loading page</h2>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
      <p className="loading-text">
        You will be redirected to the budgeting page in{" "}
        <span className="loading-countdown">{countdown}</span> seconds.
      </p>
    </div>
  );
};

export default LoadingPage;
