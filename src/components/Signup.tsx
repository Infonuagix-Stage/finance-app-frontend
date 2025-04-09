import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styles from "./Signup.module.css";

const Signup: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect({ screen_hint: "signup" } as any)}
      className={styles.signupButton}
    >
      Sign Up
    </button>
  );
};

export default Signup;
