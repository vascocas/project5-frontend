import { useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import { baseWS } from "../../pages/Requests.js";

function MessageWebSocket() {
  const { token } = userStore();

  const addMessage = userStore((state) => state.addMessage);

  useEffect(() => {
    const websocket = new WebSocket(`${baseWS}message/${token}`);
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

export default MessageWebSocket;
