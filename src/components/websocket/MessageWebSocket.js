import { useEffect, useRef } from "react";
import { userStore } from "../../stores/UserStore";
import { websocketStore } from "../../stores/WebSocketStore.js";
import { baseWS } from "../../pages/Requests.js";

function MessageWebSocket() {
  const { token } = userStore();
  const addMessage = websocketStore((state) => state.addMessage);

  // Declare a ref to store the WebSocket instance
  const websocketRef = useRef(null);

  useEffect(() => {
    // Create the WebSocket instance if it doesn't exist
    if (!websocketRef.current) {
      websocketRef.current = new WebSocket(`${baseWS}message/${token}`);
      websocketRef.current.onopen = () => {
        console.log("The websocket connection is open");
      };

      websocketRef.current.onmessage = (event) => {
        const message = event.data;
        console.log("a new message is received!");
        addMessage(message);
      };
    }

    // Cleanup function to close the WebSocket connection on unmount
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, [token, addMessage]);

  // Empty dependency array to ensure this effect runs only once on mount
  useEffect(() => {}, []);

  // Return null or any desired UI component
  return null;
}

export default MessageWebSocket;
