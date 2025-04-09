import { useAuth0 } from "@auth0/auth0-react";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button onClick={() => loginWithRedirect()} className={styles.loginButton}>
      Log In
    </button>
  );
};

export default Login;
