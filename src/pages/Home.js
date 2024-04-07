import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import AddTaskForm from "../components/tasks/AddTaskForm";
import TasksBoard from "../components/tasks/TasksBoard";
import Notifications from "../components/Notifications";
import { userStore } from "../stores/UserStore";
import "../index.css";
import "./Home.css";

function Home() {
  const { token } = userStore();
  const [notifications, setNotifications] = useState([]);

  // Function to fetch user notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/project5-backend/rest/notifications",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data); // Update notifications state with fetched data
      } else {
        console.error("Failed to fetch notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div className="Home" id="home-outer-container">
      <Header />
      <Sidebar
        pageWrapId={"home-page-wrap"}
        outerContainerId={"home-outer-container"} />
      <div className="page-wrap" id="home-page-wrap">
        <h1 className="page-title">Scrum Board</h1>
        <div className="content-wrapper">
          <div className="add-task-form">
            <AddTaskForm />
          </div>
          <div className="tasks-board">
            <TasksBoard />
          </div>
          <div className="notifications-alert">
          <h3 id="notifications-h3">Notifications</h3>
            <Notifications notifications={notifications} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
