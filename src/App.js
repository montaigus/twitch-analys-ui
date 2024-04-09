import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChat, getRemoved } from "./getChatData";
import "./App.css";

const App = () => {
  const [channel, setChannel] = useState("");
  const [connected, setConnected] = useState(false);

  const serverUrl =
    process.env.NODE_ENV === "production"
      ? "http://jeans-research-server.vercel.app:3000"
      : "http://localhost:3000";

  useQueryClient();

  const queryKeyChat = ["chat"];
  const queryKeyRemoved = ["removed"];

  const queryResultChat = useQuery({
    queryKey: queryKeyChat,
    queryFn: getChat,
    refetchInterval: 1000,
  });

  const queryResultRemoved = useQuery({
    queryKey: queryKeyRemoved,
    queryFn: getRemoved,
    refetchInterval: 3000,
  });

  if (queryResultChat.isLoading) {
    return <div>Loading...</div>;
  }
  if (queryResultChat.isError) {
    return <div>Error: {queryResultChat.error.message}</div>;
  }

  function handleConnect() {
    fetch(serverUrl + "/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel: channel }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la requête");
        }
        setConnected(true);
        return response.json();
      })
      .then((data) => {
        console.log(data); // Affiche la réponse du serveur dans la console
        // Faire quelque chose avec la réponse du serveur si nécessaire
      })
      .catch((error) => {
        console.error("Erreur:", error);
        // Gérer l'erreur ici
      });
  }

  function handleDisconnect() {
    fetch(serverUrl + "/disconnect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel: channel }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la requête");
        }
        setConnected(false);
        return response.json();
      })
      .then((data) => {
        console.log(data); // Affiche la réponse du serveur dans la console
        // Faire quelque chose avec la réponse du serveur si nécessaire
      })
      .catch((error) => {
        console.error("Erreur:", error);
        // Gérer l'erreur ici
      });
  }

  return (
    <>
      <div className="header">
        <div className="title">Les recherches de Jean</div>
      </div>
      <div className="appContainer">
        <div className="search_bar">
          <input
            type="text"
            className="input_channel"
            placeholder="Chaine à suivre"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
          {!connected && (
            <button className="button_connect" onClick={handleConnect}>
              Se connecter
            </button>
          )}
          {connected && (
            <button className="button_disconnect" onClick={handleDisconnect}>
              Se déconnecter
            </button>
          )}
          {connected && (
            <a
              className="button_download"
              href={`${serverUrl}/download-json?channel=${channel}`}
            >
              Télécharger
            </a>
          )}
          {connected && <button className="button_clear">Nettoyer</button>}
        </div>
        <div className="displayer">
          <div className="chat_holder">
            {!queryResultChat.data && (
              <div className="message">Rien à afficher</div>
            )}
            {queryResultChat.data &&
              queryResultChat.data.map((msg) => (
                <div
                  className="message"
                  key={msg.data.id}
                >{`${msg.data.user} : ${msg.data.message}`}</div>
              ))}
          </div>
          <div className="removed_holder">
            {!queryResultRemoved.data && (
              <div className="message">Rien à afficher</div>
            )}
            {queryResultRemoved.data &&
              queryResultRemoved.data.map((msg) => (
                <div
                  className="message"
                  key={msg.data.id}
                >{`${msg.data.user} : ${msg.data.message}`}</div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
