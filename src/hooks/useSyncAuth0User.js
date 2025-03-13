import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import axios from "axios";

const useSyncAuth0User = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
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
      }
    };

    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently]);
};

export default useSyncAuth0User;
