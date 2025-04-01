import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";

// Define a type for the Auth0 user object
interface Auth0User {
  sub: string;
  email?: string;
  name?: string;
}

const useSyncAuth0User = (): void => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const syncUser = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const token = await getAccessTokenSilently();
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/login`,
          {
            auth0UserId: user.sub,
            email: user.email,
            name: user.name,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error("Error syncing user with backend:", error);
      }
    };

    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);
};

export default useSyncAuth0User;
