import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./LoadingPage.module.css";

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
    <div className={styles.loadingContainer}>
      <h2 className={styles.loadingTitle}>Welcome to the loading page</h2>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
      <p className={styles.loadingText}>
        You will be redirected to the budgeting page in{" "}
        <span className={styles.loadingCountdown}>{countdown}</span> seconds.
      </p>
    </div>
  );
};

export default LoadingPage;
