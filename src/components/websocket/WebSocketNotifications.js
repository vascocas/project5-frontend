import { useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import { notificationStore } from "../../stores/NotificationStore";

function WebSocketClient() {
  const { token } = userStore();
  const addNotification = notificationStore((state) => state.addNotification);

  const WS_URL = `ws://localhost:8080/project5-backend/websocket/notification/${token}`;
  
  useEffect(() => {
    const websocket = new WebSocket(WS_URL);
    websocket.onopen = () => {
      console.log("The websocket connection is open");
    };
    websocket.onmessage = (event) => {
      const notification = event.data;
      console.log("a new notification is received!");
      addNotification(notification);
    };
  }, []);

}
export default WebSocketClient;
