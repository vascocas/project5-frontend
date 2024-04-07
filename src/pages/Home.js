import React, { useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import AddTaskForm from "../components/tasks/AddTaskForm";
import TasksBoard from "../components/tasks/TasksBoard";
import { Link } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { notificationStore } from "../stores/NotificationStore";
import "../index.css";
import "./Home.css";

function Home() {
  const { token } = userStore();
  const { updateNotifications, unreadCount, setUnreadCount } = notificationStore();

 // Function to fetch user notifications
 useEffect(() => {
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
      updateNotifications(data);
      const unreadCounter = data.filter(notification => !notification.readStatus).length;
      setUnreadCount(unreadCounter);
    } else {
      console.error("Failed to fetch notifications:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

fetchNotifications();
}, [token, updateNotifications, setUnreadCount]);

  return (
    <div className="Home" id="home-outer-container">
      <Header />
      <Sidebar
        pageWrapId={"home-page-wrap"}
        outerContainerId={"home-outer-container"}
      />
      <div className="page-wrap" id="home-page-wrap">
        <div className="top-page">
          <div className="home-title">
            <h1 className="page-title">Scrum Board</h1>
          </div>
          <div className="notifications-alert">
            <Link to={`/notifications`} className="notifications-link">
              <h3 id="notifications-h3">{unreadCount} Notifications</h3>
            </Link>
          </div>
        </div>
        <div className="bottom-page">
          <div className="content-wrapper">
            <div className="add-task-form">
              <AddTaskForm />
            </div>
            <div className="tasks-board">
              <TasksBoard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
