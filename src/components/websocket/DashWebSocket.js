import { useEffect, useRef } from "react";
import { userStore } from "../../stores/UserStore.js";
import { dashboardStore } from "../../stores/DashboardStore";
import { baseWS } from "../../pages/Requests.js";
import { fetchUsersCount, fetchUserRegistrationsData, fetchAverageTasks, fetchAverageDuration, fetchTasksState, fetchCategoriesFrequency, fetchTasksCompletedData} from "../../pages/Dashboard.js";

function DashWebSocket() {
  const { token } = userStore();
  const {  setTotalUsers,
    setValidatedUsers,
     setNonValidatedUsers,
        setUserRegistrations,
         setAverageTasksPerUser,
         setAverageTasksDuration,
         setTasksPerStatus,
        setCategoriesFrequency,
        setTasksCompletedOverTime } = dashboardStore();

  // Declare a ref to store the WebSocket instance
  const websocketRef = useRef(null);

  useEffect(() => {
    // Create the WebSocket instance if it doesn't exist
    if (!websocketRef.current) {
      websocketRef.current = new WebSocket(`${baseWS}dashboard/${token}`);
      websocketRef.current.onopen = () => {
        console.log("Dashboard websocket is open");
      };

      websocketRef.current.onmessage = (event) => {
        const message = event.data;
        console.log("a new action is received!", message);

        // Check the type of action received
        if (message === "DashboardUserUpdate") {
          fetchUsersCount(token, setTotalUsers, setValidatedUsers, setNonValidatedUsers);
          fetchUserRegistrationsData(token, setUserRegistrations);
        } else if (message === "DashboardTaskUpdate") {
          fetchAverageTasks(token, setAverageTasksPerUser);
          fetchAverageDuration(token, setAverageTasksDuration);
          fetchTasksState(token, setTasksPerStatus);
          fetchCategoriesFrequency(token, setCategoriesFrequency);
          fetchTasksCompletedData(token, setTasksCompletedOverTime);
        }
      };
    }

    // Cleanup function to close the WebSocket connection on unmount
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
        console.log("Closing dashboard websocket");
      }
    };
  }, []);


  // Return null or any desired UI component
  return null;

}

export default DashWebSocket;
