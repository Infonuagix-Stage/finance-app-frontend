import { useAuth0 } from "@auth0/auth0-react";

export const useToken = (): (() => Promise<string>) => {
  const { getAccessTokenSilently } = useAuth0();

  const getToken = async (): Promise<string> => {
    try {
      const token = await getAccessTokenSilently();
      console.log("Access Token récupéré:", token);
      return token;
    } catch (error) {
      console.error("Erreur de récupération du token:", error);
      throw error;
    }
  };

  return getToken;
};

export default useToken;
