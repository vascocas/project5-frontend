import { useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import { notificationStore } from "../../stores/NotificationStore";

function WebSocketMessages() {
  const { token } = userStore();
  const addMessage = notificationStore((state) => state.addMessage);

  const WS_URL = `ws://localhost:8080/project5-backend/websocket/message/${token}`;
  
  useEffect(() => {
    const websocket = new WebSocket(WS_URL);
    websocket.onopen = () => {
      console.log("The websocket connection is open");
    };
    websocket.onmessage = (event) => {
      const message = event.data;
      console.log("a new message is received!");
      addMessage(message);
    };
  }, []);


}
export default WebSocketMessages;
