import React, { useEffect } from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { notificationStore } from "../stores/NotificationStore";
import "./Notifications.css";

const Notifications = () => {
  const { token } = userStore();
  const { notifications, setUnreadCount } = notificationStore();
  const navigate = useNavigate();

  // Function to handle marking all user notifications as read
  useEffect(() => {
    const markAllAsRead = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/project5-backend/rest/notifications/read`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );

        if (response.ok) {
          // Update the unread count
          setUnreadCount(0);
        } else {
          console.error(
            "Failed to mark notifications as read:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    };

    markAllAsRead();
  }, [token, setUnreadCount]);

  const handleNotificationClick = (notification) => {
    const content = notification.contentText;
    const username = content.replace("New message from: ", ""); // Remove the prefix
    navigate(`/profile/${username}`); // Navigate to sender's profile
  };

  return (
    <div>
      <div className="title">
        <h3>Notifications</h3>
        <div className="notification-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification ${
                notification.readStatus ? "read" : ""
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-content">
              <div className="notification-time"><strong>Time: </strong> {notification.creationTime.replace(/\[UTC\]/g, '').substring(0, 19)}</div>
              <div className="notification-message"><strong>Message: </strong>{notification.contentText}</div>
              <div className="notification-icon">{notification.readStatus ? <FaCheckDouble /> : <FaCheck />}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="back-button">
          <button id="back-button" onClick={() => navigate("/Home")}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
