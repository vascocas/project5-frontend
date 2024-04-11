import { useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import { baseWS } from "../../pages/Requests.js";

function NotifWebSocket() {
  const { token } = userStore();

  const addNotification = userStore((state) => state.addNotification);

  useEffect(() => {
    const websocket = new WebSocket(`${baseWS}notification/${token}`);
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

export default NotifWebSocket;