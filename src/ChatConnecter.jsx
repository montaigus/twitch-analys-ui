import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const serverUrl =
  process.env.NODE_ENV === "production"
    ? "https://twitch-analys-server.vercel.app"
    : "http://localhost:3000";

function ChatConnecter(props) {
  const [channel, setChannel] = useState("");
  const queryClient = useQueryClient();

  return (
    <>
      <div className="search_bar">
        <input
          type="text"
          className="input_channel"
          placeholder="Chaine à suivre"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        />

        <button className="button_connect" onClick={handleConnect}>
          Se connecter
        </button>
      </div>
    </>
  );

  function handleConnect() {
    //! pourquoi ça marche pas ?
    queryClient.invalidateQueries({ queryKey: ["channel"] });
    props.setRerender(true);
    //queryClient.refetchQueries({ queryKey: ["channels"] });
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
}

export default ChatConnecter;
