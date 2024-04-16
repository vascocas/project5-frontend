import { useEffect, useRef } from "react";
import { userStore } from "../../stores/UserStore";
import { websocketStore } from "../../stores/WebSocketStore.js";
import { baseWS } from "../../pages/Requests.js";
import { fetchChatMessages } from "../../pages/PublicProfile.js";

function MessageWebSocket() {
  const { token, loggedId } = userStore();
  const { setChatMessages, chatId } = websocketStore();

  // Declare a ref to store the WebSocket instance
  const websocketRef = useRef(null);

  useEffect(() => {
    // Create the WebSocket instance if it doesn't exist
    if (!websocketRef.current) {
      websocketRef.current = new WebSocket(`${baseWS}message/${token}`);
      websocketRef.current.onopen = () => {
        console.log("The websocket connection is open");
      };

      websocketRef.current.onmessage = async (event) => {
        const message = event.data;
        console.log("a new action is received!", message);

        // Check the type of action received
        if (message === "MessagesChanged") {
          console.log("Fetching messages...");

          await fetchChatMessages(loggedId, token, chatId, setChatMessages);
          console.log("Messages fetched");
        }
      };
    }

    // Cleanup function to close the WebSocket connection on unmount
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, []);

  // Empty dependency array to ensure this effect runs only once on mount
  useEffect(() => {}, []);

  // Return null or any desired UI component
  return null;
}

export default MessageWebSocket;
