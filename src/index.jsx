import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

export const serverUrl =
  process.env.NODE_ENV === "production"
    ? "https://twitch-analys-server.onrender.com"
    : "http://localhost:3000";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <div className="header">
        <div id="main_title">Projet Comprev</div>
        <a
          id="button_download"
          className="button"
          href={`${serverUrl}/download-json`}
        >
          Télécharger
        </a>
      </div>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
