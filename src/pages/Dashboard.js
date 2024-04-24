import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import { baseURL } from "./Requests";
import { userStore } from "../stores/UserStore";
import "./Dashboard.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
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
        console.error(
          "Failed to fetch average tasks data:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching average tasks data:", error);
    }
  };

  const fetchAverageDuration = async () => {
    try {
      const response = await fetch(
        `${baseURL}dashboard/tasks/average/duration`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        setAverageTasksDuration(responseData);
      } else {
        console.error(
          "Failed to fetch average duration data:",
          response.statusText
        );
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
        const taskStateSummaries = responseData.map((item) => ({
          field: item.field,
          sum: item.sum,
        }));
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
        const categoriesData = responseData.map((item) => ({
          field: item.field,
          sum: item.sum,
        }));
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
        const formattedData = responseData.map((item) => ({
          date: item.date,
          value: item.value,
        }));
        setUserRegistrations(formattedData);
      } else {
        console.error(
          "Failed to fetch user registrations data:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching user registrations data:", error);
    }
  };

  const fetchTasksCompletedData = async () => {
    try {
      const response = await fetch(
        `${baseURL}dashboard/tasks/completed/count`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        // ResponseData is an array of user registration counts (List<DayCount>)
        const formattedData = responseData.map((item) => ({
          date: item.date,
          value: item.value,
        }));
        setTasksCompletedOverTime(formattedData);
      } else {
        console.error(
          "Failed to fetch tasks completed data:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching tasks completed data:", error);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <Sidebar />
      <div className="content-container">
        <h1 className="page-title">Dashboard</h1>
        <div className="dashboard-container">
          <div className="metrics-container">
            <div className="user-container">
              <h2 className="user-heading">Users Count</h2>
              <div className="user-count-container">
                <div className="labels">
                  <p>Total Users:</p>
                  <p>Validated Users:</p>
                  <p>Non-Validated Users:</p>
                </div>
                <div className="values">
                  <p className="user-count">{totalUsers}</p>
                  <p className="user-count">{validatedUsers}</p>
                  <p className="user-count">{nonValidatedUsers}</p>
                </div>
              </div>
            </div>
            <div className="tasks-container">
              <h2 className="task-heading">Tasks Metrics</h2>
              <div className="tasks-metrics-container">
                <div className="labels">
                  <p>Average Tasks per User:</p>
                  <p>Average Task Conclusion Duration:</p>
                </div>
                <div className="values">
                  <p className="tasks-count">{averageTasksPerUser}</p>
                  <p className="tasks-count">{averageTasksDuration}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bar-chart-container">
            <div className="chart">
              <h2>Tasks per Status</h2>
              <BarChart
                width={500}
                height={300}
                data={tasksPerStatus}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sum" name="Tasks Count" fill="#4e58ee" />
              </BarChart>
            </div>
            <div className="chart">
              <h2>Categories Frequency</h2>
              <BarChart
                width={500}
                height={300}
                data={categoriesFrequency}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sum" name="Frequency" fill="#4e58ee" />
              </BarChart>
            </div>
          </div>
          <div className="line-chart-container">
            <div>
              <h2>Tasks Completed Over Time</h2>
              <div>
                <LineChart
                  width={450}
                  height={300}
                  data={tasksCompletedOverTime}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#4e58ee" />
                </LineChart>
              </div>
            </div>
            <div>
              <h2>User Registrations Over Time</h2>
              <div>
                <LineChart width={450} height={300} data={userRegistrations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#4e58ee" />
                </LineChart>
              </div>
            </div>
          </div>
        </div>
        <div className="homeMenu-button-container">
          <button
            className="recycle-home-button"
            onClick={() => navigate("/Home")}
          >
            Back to Scrum Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
