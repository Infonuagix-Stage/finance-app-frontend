import { useAuth0 } from "@auth0/auth0-react";
import "./Logout.css"; // Import the CSS file

const Logout: React.FC = () => {
  const { logout, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null; // Hide button if not authenticated

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="logout-button"
    >
      Log Out
    </button>
  );
};

export default Logout;
