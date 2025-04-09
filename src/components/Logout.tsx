import { useAuth0 } from "@auth0/auth0-react";
import styles from "./Logout.module.css";

const Logout: React.FC = () => {
  const { logout, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className={styles.logoutButton}
    >
      Log Out
    </button>
  );
};

export default Logout;
