import { useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import { websocketStore } from "../../stores/WebSocketStore";
import { baseWS } from "../../pages/Requests.js";

function WebSocketClient({ endpoint, onDataReceived, storeAction }) {
  const { token } = userStore();
  const action = websocketStore((state) => state[storeAction]);

  useEffect(() => {
    const websocket = new WebSocket(`${baseWS}${endpoint}/${token}`);
    websocket.onopen = () => {
      console.log("The websocket connection is open");
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("New data received:", data);
      onDataReceived(data);
      websocketStore.setData(data);

    };

    // Clean up function to close the WebSocket connection when the component unmounts
    return () => {
      websocket.close();
    };
  }, [action, endpoint, onDataReceived, token]);

  return null; // Since this component doesn't render anything, return null
}

export default WebSocketClient;
