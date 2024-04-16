import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChat, getRemoved, serverUrl } from "./getChatData.js";
import "./App.css";
import { storedMessage, channelAllMsg } from "./types.ts";

type ChatListenerProps = {
  allChat: channelAllMsg;
  channel: string;
};

const ChatListener = (props: ChatListenerProps) => {
  const queryClient = useQueryClient();

  const chatMsg: storedMessage[] = props.allChat.chatMsg || [];
  const removedMsg: storedMessage[] = props.allChat.removedMsg || [];
  const channel = props.channel.substring(1).toString();

  return (
    <>
      <div className="search_bar">
        <input
          type="text"
          className="input_channel"
          placeholder="Chaine à suivre"
          value={channel}
          disabled={true}
        />
        <button
          className="button_disconnect"
          onClick={(e) => {
            //e.target.disabled = true;
            handleDisconnect();
          }}
        >
          X
        </button>
      </div>
      <div className="displayer">
        <div className="chat_holder">
          {chatMsg.map((msg) => (
            <div
              className="message"
              key={msg.id}
            >{`${msg.user} : ${msg.message}`}</div>
          ))}
        </div>
        <div className="removed_holder">
          {removedMsg.map((msg) => (
            <div
              className="message"
              key={msg.id}
            >{`${msg.user} : ${msg.message}`}</div>
          ))}
        </div>
      </div>
    </>
  );

  function handleDisconnect() {
    //! pourquoi ça marche pas ?
    queryClient.invalidateQueries({ queryKey: ["channels"] });
    //props.setRerender(true);
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
};

export default ChatListener;
