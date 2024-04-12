import { useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import { websocketStore } from "../../stores/WebSocketStore.js";
import { baseWS } from "../../pages/Requests.js";
import { fetchChatMessages } from "../messages/ChatMessages.js";
import { useParams } from "react-router-dom";

function MessageWebSocket() {
  const { token, loggedId } = userStore();
  const addMessage = websocketStore((state) => state.addMessage);
  const { usernameParam } = useParams();

  useEffect(() => {
    function connectWebSocket(){
    console.log("Connecting to WebSocket...");
    const websocket = new WebSocket(`${baseWS}message/${token}`);

    websocket.onopen = () => {
      console.log("The websocket connection is open");
    };

    websocket.onmessage = (event) => {
      const message = event.data;
      console.log("Received a new message:", message);
      addMessage(message);

      console.log("usernameParam ==> ", usernameParam);
      console.log("token ==> ", token);
      console.log("loggedId ==> ", loggedId);
      
      // Call fetchChatMessages() when a new message is received
      fetchChatMessages(usernameParam, token, loggedId);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    websocket.onclose = () => {
      console.log("WebSocket connection closed");
      connectWebSocket();
    };

  }

  connectWebSocket();
  }, []); 

}

export default MessageWebSocket;