import { useEffect, useRef } from "react";
import { userStore } from "../../stores/UserStore";
import { websocketStore } from "../../stores/WebSocketStore.js";
import { baseWS } from "../../pages/Requests.js";
import { fetchNotifications } from "../../pages/Home.js";

function NotifWebSocket() {
  const { token } = userStore();
  const { updateNotifications, setUnreadCount } = websocketStore();
  
  // Declare a ref to store the WebSocket instance
  const websocketRef = useRef(null);

  useEffect(() => {
    // Create the WebSocket instance if it doesn't exist
    if (!websocketRef.current) {
      websocketRef.current = new WebSocket(`${baseWS}notification/${token}`);
      websocketRef.current.onopen = () => {
        console.log("Notification websocket is open");
      };

      websocketRef.current.onmessage = (event) => {
        console.log(event.data);
        const message = event.data;
        // Check the type of action received
        console.log("a new action is received!", message);
        if (message === "NotificationUpdate") {
        // Updated the displayed notifications
        fetchNotifications(token, updateNotifications, setUnreadCount);
      }
    };
  }

  // Cleanup function to close the WebSocket connection on unmount
  return () => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
      console.log("Closing notification websocket");
    }
  };

 
}, []);

// Empty dependency array to ensure this effect runs only once on mount
useEffect(() => {}, []);

// Return null or any desired UI component
return null;
}

export default NotifWebSocket;
