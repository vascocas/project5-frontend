import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import TasksSummary from '../components/tasks/TasksSummary';
import DayCount from '../components/tasks/DayCount';
import { baseURL } from "./Requests";
import { userStore } from "../stores/UserStore";
import "./Dashboard.css";
import {
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const { token } = userStore();
  const [totalUsers, setTotalUsers] = useState(0);
  const [validatedUsers, setValidatedUsers] = useState(0);
  const [nonValidatedUsers, setNonValidatedUsers] = useState(0);
  const [averageTasksPerUser, setAverageTasksPerUser] = useState(0);
  const [averageTasksDuration, setAverageTasksDuration] = useState(0);
  const [tasksPerStatus, setTasksPerStatus] = useState({});
  const [categoriesFrequency, setCategoriesFrequency] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [tasksCompletedOverTime, setTasksCompletedOverTime] = useState([]);

  useEffect(() => {
    fetchUsersCount();
    fetchTasksState();
    fetchAverageTasks();
    fetchAverageDuration();
    fetchCategoriesFrequency();
    fetchUserRegistrationsData();
    fetchTasksCompletedData();
  }, []);

  const fetchUsersCount = async () => {
    try {
      const response = await fetch(`${baseURL}dashboard/users/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        // Extract data from the response
        const { totalUsers, validatedUsers, nonValidatedUsers } = responseData;
  
        // Update state with the extracted data
        setTotalUsers(totalUsers);
        setValidatedUsers(validatedUsers);
        setNonValidatedUsers(nonValidatedUsers);
      } else {
        console.error("Failed to fetch users data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
    }
  };
 

  const fetchAverageTasks = async () => {
    try {
      const response = await fetch(`${baseURL}dashboard/average/tasks/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setAverageTasksPerUser(responseData);
      } else {
        console.error("Failed to fetch average tasks data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching average tasks data:", error);
    }
  };
  

  const fetchAverageDuration = async () => {
    try {
      const response = await fetch(`${baseURL}dashboard/tasks/average/duration`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        setAverageTasksDuration(responseData);
      } else {
        console.error("Failed to fetch average duration data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching average duration data:", error);
    }
  };

  const fetchTasksState = async () => {
    try {
      const response = await fetch(`${baseURL}dashboard/tasks/state`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        // Extract data from the response (List<TasksSummary>)
        const taskStateSummaries = responseData.map(item => new TasksSummary(item.field, item.sum));
        // Update state with tasks per status data
        setTasksPerStatus(taskStateSummaries);
      } else {
        console.error("Failed to fetch tasks state data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching tasks state data:", error);
    }
  };
  

  const fetchCategoriesFrequency = async () => {
    try {
      const response = await fetch(`${baseURL}dashboard/categories/frequency`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
      // Extract data from the response (List<TasksSummary>)
      const categoriesData = responseData.map(item => new TasksSummary(item.field, item.sum));
      // Update state with categories data
      setCategoriesFrequency(categoriesData);
    } else {
      console.error("Failed to fetch categories data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching categories data:", error);
  }
};
  

  const fetchUserRegistrationsData = async () => {
    try {
      const response = await fetch(`${baseURL}dashboard/users/weekly/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
      // ResponseData is an array of user registration counts (List<DayCount>)
      const formattedData = responseData.map(item => new DayCount(item.date, item.value));
      setUserRegistrations(formattedData);
      } else {
        console.error("Failed to fetch user registrations data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user registrations data:", error);
    }
  };


  const fetchTasksCompletedData = async () => {
    try {
      const response = await fetch(`${baseURL}dashboard/tasks/completed/count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });
      if (response.ok) {
        const responseData = await response.json();
        // ResponseData is an array of user registration counts (List<DayCount>)
        const formattedData = responseData.map(item => new DayCount(item.date, item.value));
        setTasksCompletedOverTime(formattedData);
      } else {
        console.error("Failed to fetch tasks completed data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching tasks completed data:", error);
    }
  };


return (
  <div className="Dashboard" id="dashboard-outer-container">
    <Header />
    <Sidebar pageWrapId={"dashboard-page-wrap"}
      outerContainerId={"dashboard-outer-container"} />
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div>
        <p>Total Users: {totalUsers}</p>
        <p>Validated Users: {validatedUsers}</p>
        <p>Non-Validated Users: {nonValidatedUsers}</p>
        <p>Average Tasks per User: {averageTasksPerUser}</p>
        <div>
          <h2>Tasks per Status</h2>
          <ul>
            {Object.keys(tasksPerStatus).map((status) => (
              <li key={status}>
                {status}: {tasksPerStatus[status]}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Categories</h2>
          <ol>
            {categories.map((category, index) => (
              <li key={index}>{category}</li>
            ))}
          </ol>
        </div>
        <div>
          <h2>User Registrations Over Time</h2>
          <div>
            <LineChart width={600} height={300} data={userRegistrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pv" stroke="#8884d8" />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </div>
        </div>
        <div>
          <h2>Tasks Completed Over Time</h2>
          <div>
            <ScatterChart
              width={400}
              height={400}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="x" />
              <YAxis type="number" dataKey="y" name="y" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="A Scatter Plot" data={tasksCompletedOverTime} fill="#8884d8" />
            </ScatterChart>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default Dashboard;
