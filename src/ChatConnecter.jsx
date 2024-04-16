import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const serverUrl =
  process.env.NODE_ENV === "production"
    ? "https://twitch-analys-server.vercel.app"
    : "http://localhost:3000";

function ChatConnecter() {
  const [channel, setChannel] = useState("");
  const [disabled, setDisabled] = useState(false);
  const queryClient = useQueryClient();

  const mutationConnect = useMutation({
    mutationFn: handleConnect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      setChannel("");
      setDisabled(false);
    },
  });

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

        <button
          className="button_connect"
          disabled={disabled}
          onClick={(e) => {
            setDisabled(true);
            mutationConnect.mutate();
          }}
        >
          Se connecter
        </button>
      </div>
    </>
  );

  async function handleConnect() {
    const response = await fetch(serverUrl + "/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel: channel }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la requête");
    }
    /*const json = await response.json();
    /*.catch((error) => {
      console.error("Erreur:", error);
      // Gérer l'erreur ici
    });
    console.log(json);
    return json.data;
    */
  }
}

export default ChatConnecter;
