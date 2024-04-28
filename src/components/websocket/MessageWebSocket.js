import { useEffect, useRef } from "react";
import { userStore } from "../../stores/UserStore";
import { websocketStore } from "../../stores/WebSocketStore.js";
import { baseWS } from "../../pages/Requests.js";
import { fetchChatMessages } from "../../pages/PublicProfile.js";

function MessageWebSocket() {
  const { token } = userStore();
  const { setChatMessages } = websocketStore();

  // Declare a ref to store the WebSocket instance
  const websocketRef = useRef(null);

  useEffect(() => {
    // Create the WebSocket instance if it doesn't exist
    if (!websocketRef.current) {
      websocketRef.current = new WebSocket(`${baseWS}message/${token}`);
      websocketRef.current.onopen = () => {
        console.log("Message websocket is open");
      };

      websocketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data); // Parse the JSON string
        console.log("A new action is received!");

        const senderId = message.senderId;
        const receiverId = message.receiverId;
        fetchChatMessages(senderId, token, receiverId, setChatMessages);
      };
    }

    // Cleanup function to close the WebSocket connection on unmount
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
        console.log("Closing message websocket");
      }
    };
  }, []);

  // Empty dependency array to ensure this effect runs only once on mount
  useEffect(() => {}, []);

  // Return null or any desired UI component
  return null;
}

export default MessageWebSocket;
