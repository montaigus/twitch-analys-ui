import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { serverUrl } from "./getChatData.js";
import "./App.css";
import ChatListener from "./ChatListener.tsx";
import ChatConnecter from "./ChatConnecter.jsx";
import { storedMessage, channelAllMsg } from "./types.ts";

function App() {
  //! pourquoi ça marche pas ?
  const [rerender, setRerender] = useState(false);

  useQueryClient();

  const queryChannel = useQuery({
    queryKey: ["channels"],
    queryFn: getChannels,
  });

  const queryResultAllChat = useQuery({
    queryKey: ["AllChat"],
    queryFn: getAllChat,
    refetchInterval: 1000,
  });

  if (queryChannel.isLoading) {
    return <div>Loading channels...</div>;
  }
  if (queryChannel.isError) {
    return <div>Error: {queryChannel.error.message}</div>;
  }
  if (queryResultAllChat.isLoading) {
    return <div>Loading chat...</div>;
  }
  if (queryResultAllChat.isError) {
    return <div>Error: {queryResultAllChat.error.message}</div>;
  }

  const channels = queryChannel.data;
  console.log(queryResultAllChat.data);

  return (
    <>
      <div className="appContainer">
        {channels.map((chan) => {
          const messages: channelAllMsg = queryResultAllChat.data.filter(
            (o) => o.channel.toLowerCase() === chan
          );
          return (
            <ChatListener
              key={channels.indexOf(chan)}
              channel={chan}
              allChat={messages}
              //setRerender={setRerender}
            ></ChatListener>
          );
        })}
        <ChatConnecter setRerender={setRerender} />
      </div>
    </>
  );

  async function getChannels() {
    const apiRes = await fetch(`${serverUrl}/channels`);
    if (!apiRes.ok) {
      //?on verra ça plus tard
      //throw new console.error("not ok");
    }
    const result = apiRes.json();
    //setChannels(result);
    console.log(result);
    return result;
  }

  async function getAllChat({ queryKey }) {
    const apiRes = await fetch(`${serverUrl}/allchat`);
    if (!apiRes.ok) {
      //?on verra ça plus tard
      //throw new console.error("not ok");
    }
    return apiRes.json();
  }
}

export default App;
