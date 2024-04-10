import { useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import { notificationStore } from "../../stores/NotificationStore";

function WebSocketNotifications() {
  const { token } = userStore();
  const addNotification = notificationStore((state) => state.addNotification);

  useEffect(() => {
    const websocket = new WebSocket(
      `ws://localhost:8080/project5-backend/websocket/notification/${token}`
    );

    websocket.onopen = () => {
      console.log("The websocket connection is open");
    };

    websocket.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      console.log("a new notification is received!");
      addNotification(notification);
    };

    // Clean up function to close the WebSocket connection when the component unmounts
    return () => {
      websocket.close();
    };
  }, [addNotification, token]); // Add addNotification and token to the dependency array to prevent unnecessary reconnections

  return null; // Since this component doesn't render anything, return null
}
export default WebSocketNotifications;

