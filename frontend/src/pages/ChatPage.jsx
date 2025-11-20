import React, { useEffect, useState } from "react";
import useParams from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";
import toast from "react-hot-toast";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data:tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, //This will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
     if(!tokenData || !authUser) return ;

     try{
       console.log("Initializing stream chat client");
       const client = StreamChat.getInstance(STREAM_API_KEY)

       await client.connectUser({
        id: authUser._id,
        name: authUser.fullName,
        image: authUser.profilePic
       }, tokenData.token)

       const channelId = [authUser._id, targetUserId].sort().join("-");

       // you and me
       // if i start the chat => channelId: [myId, yourId]
       // if you start the chat => channelId: [yourId, myId]

       const currChannel = client.channel("messaging", channelId, {
         members: [authUser._id, targetUserId]        
       })

       await currChannel.watch();

       setChatClient(client);
       setChannel(currChannel);

     }catch(error){
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again")
     }finally{
      setLoading(false)
     }
    }
    initChat()
  }, [])

  return <div>ChatPage</div>;
};

export default ChatPage;
