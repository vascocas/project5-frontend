import { useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import { websocketStore } from "../../stores/WebSocketStore.js";
import { baseWS } from "../../pages/Requests.js";

function MessageWebSocket() {
  const { token } = userStore();
  const addMessage = websocketStore((state) => state.addMessage);

  useEffect(() => {
    console.log("Connecting to WebSocket...");
    const websocket = new WebSocket(`${baseWS}message/${token}`);

    websocket.onopen = () => {
      console.log("The websocket connection is open");
    };

    websocket.onmessage = (event) => {
      const message = event.data;
      console.log("Received a new message:", message);
      addMessage(message);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup function
    return () => {
      console.log("Closing WebSocket connection");
      websocket.close();
    };
  }, [token, addMessage]); 

}

export default MessageWebSocket;