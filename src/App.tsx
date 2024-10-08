import React from "react";
import {
  UseQueryResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import "./App.css";
import ChatListener from "./ChatListener.tsx";
import ChatConnecter from "./ChatConnecter.jsx";
import { ChannelAllMsg, StoredMessage } from "./types.ts";
import { serverUrl } from "./index.jsx";

function App() {
  useQueryClient();

  const queryChannel = useQuery({
    queryKey: ["channels"],
    queryFn: getChannels,
  });

  const queryResultAllChat: UseQueryResult<StoredMessage[], Error> = useQuery({
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
  console.log({ channels });
  return (
    <>
      <div className="appContainer">
        {channels?.map((chan) => {
          const messages: StoredMessage[] = queryResultAllChat.data.filter(
            (msg) => msg.channel.toLowerCase() === chan
          );
          return (
            <ChatListener
              key={chan}
              channel={chan}
              allChat={messages}
              //setRerender={setRerender}
            ></ChatListener>
          );
        })}
        <ChatConnecter />
      </div>
    </>
  );

  async function getChannels() {
    console.log("channels");
    const apiRes = await fetch(`${serverUrl}/channels`);
    if (!apiRes.ok) {
      //?on verra ça plus tard
      //throw new console.error("not ok");
    }
    const result: string[] = await apiRes.json();

    return result;
  }

  async function getAllChat({ queryKey }) {
    const apiRes = await fetch(`${serverUrl}/allchat`);
    if (!apiRes.ok) {
      //?on verra ça plus tard
      //throw new console.error("not ok");
    }
    const result: ChannelAllMsg[] = await apiRes.json();

    return result;
  }
}

export default App;
