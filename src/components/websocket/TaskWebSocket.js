import { useEffect, useRef } from "react";
import { userStore } from "../../stores/UserStore";
import { taskStore } from "../../stores/TaskStore.js";
import { baseWS } from "../../pages/Requests.js";
import { fetchTasks } from "../tasks/TasksBoard";

function TaskWebSocket() {
  const { token } = userStore();
  const { setTasks } = taskStore();

  // Declare a ref to store the WebSocket instance
  const websocketRef = useRef(null);

  useEffect(() => {
    // Create the WebSocket instance if it doesn't exist
    if (!websocketRef.current) {
      websocketRef.current = new WebSocket(`${baseWS}task/${token}`);
      websocketRef.current.onopen = () => {
        console.log("Task websocket is open");
      };

      websocketRef.current.onmessage = (event) => {
        const message = event.data;
        console.log("a new action is received!", message);

        // Check the type of action received
        if (message === "TasksChanged") {
          console.log("Fetching tasks...");
          fetchTasks(token, "", "", setTasks); // Call fetchTasks with appropriate parameters
        }
      };
    }

    // Cleanup function to close the WebSocket connection on unmount
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
        console.log("Closing task websocket");
      }
    };
  }, []);

  // Empty dependency array to ensure this effect runs only once on mount
  useEffect(() => {}, []);

  // Return null or any desired UI component
  return null;
}

export default TaskWebSocket;
