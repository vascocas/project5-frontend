import { useEffect, useRef } from "react";
import { userStore } from "../../stores/UserStore";
import { taskStore } from "../../stores/TaskStore.js";
import { baseWS } from "../../pages/Requests.js";

function TaskWebSocket() {
  const { token } = userStore();
  const { deleteTask, updateTask } = taskStore();

  // Declare a ref to store the WebSocket instance
  const websocketRef = useRef(null);

  useEffect(() => {
    // Create the WebSocket instance if it doesn't exist
    if (!websocketRef.current) {
      websocketRef.current = new WebSocket(`${baseWS}task/${token}`);
      websocketRef.current.onopen = () => {
        console.log("The websocket connection is open");
      };

      websocketRef.current.onmessage = (event) => {
        const message = event.data;
        console.log("a new action is received!");
        updateTask(message);
        deleteTask(message);
      };
    }

    // Cleanup function to close the WebSocket connection on unmount
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, [token, updateTask, deleteTask]);

  // Empty dependency array to ensure this effect runs only once on mount
  useEffect(() => {}, []);

  // Return null or any desired UI component
  return null;
}

export default TaskWebSocket;
