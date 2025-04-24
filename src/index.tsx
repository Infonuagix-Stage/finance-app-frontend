import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider } from "./context/ThemeContext";
import "./i18n";

// Ensure environment variables are correctly typed
const domain: string = process.env.REACT_APP_AUTH0_DOMAIN || "";
const clientId: string = process.env.REACT_APP_AUTH0_CLIENT_ID || "";
const audience: string = process.env.REACT_APP_AUTH0_AUDIENCE || "";

// Ensure that we have necessary environment variables
if (!domain || !clientId || !audience) {
  console.error("Missing Auth0 environment variables. Please check your .env file.");
}

const rootElement = document.getElementById("root");

// Ensure rootElement is not null
if (!rootElement) {
  throw new Error("Root element not found. Make sure you have an element with id='root' in your index.html");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        audience: audience, // Auth0 Audience
        redirect_uri: window.location.origin,
      }}
    >
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Auth0Provider>
  </React.StrictMode>
);
