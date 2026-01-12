import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";

// Load key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error(" Missing VITE_CLERK_PUBLISHABLE_KEY in .env file");
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <BrowserRouter>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
