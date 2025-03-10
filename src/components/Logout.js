import { useAuth0 } from "@auth0/auth0-react";

const Logout = () => {
  const { logout, isAuthenticated } = useAuth0();

  return (
      <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Log Out
      </button>
    )
};
export default Logout;