import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { serverUrl } from "./index.jsx";
import "./App.css";
import { StoredMessage, ChannelAllMsg } from "./types.ts";

type ChatListenerProps = {
  allChat: StoredMessage[];
  channel: string;
};

const ChatListener = (props: ChatListenerProps) => {
  const [disabled, setDisabled] = useState(false);

  const queryClient = useQueryClient();

  const chatMsg: StoredMessage[] = props.allChat || [];
  const removedMsg: StoredMessage[] = [];
  const channel = props.channel.toString();

  const mutationDisconnect = useMutation({
    mutationFn: handleDisconnect,
    //!C'est pas ouf, mais c'est le seul moyen pour l'instant
    onSuccess: () => {
      setTimeout(
        () => queryClient.invalidateQueries({ queryKey: ["channels"] }),
        200
      );
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
          disabled={true}
        />
        <button
          className="button_disconnect"
          disabled={disabled}
          onClick={(e) => {
            setDisabled(true);
            mutationDisconnect.mutate();
          }}
        >
          X
        </button>
      </div>
      <div className="displayer">
        <div className="chat_holder">
          {chatMsg.map((msg) => {
            return (
              <div
                className="message"
                key={msg.id}
              >{`${msg.user} : ${msg.message}`}</div>
            );
          })}
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

  async function handleDisconnect() {
    const response = await fetch(serverUrl + "/disconnect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ channel: channel }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la requête");
    }
  }
};

export default ChatListener;
