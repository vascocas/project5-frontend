import React, { useEffect, useRef } from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { websocketStore } from "../stores/WebSocketStore";
import { baseURL } from "./Requests";
import NotifWebSocket from "../components/websocket/NotifWebSocket";
import "./Notifications.css";

const Notifications = () => {
  const { token } = userStore();
  const { notifications, setUnreadCount } = websocketStore();
  const navigate = useNavigate();

  // Ref for the notifications container
  const notificationsContainerRef = useRef(null);


  NotifWebSocket();

  // Function to handle marking all user notifications as read
  useEffect(() => {
    const markAllAsRead = async () => {
      try {
        const response = await fetch(
          `${baseURL}notifications/read`,
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

  useEffect(() => {
    // Scroll to the bottom of the notifications container
    if (notificationsContainerRef.current) {
      notificationsContainerRef.current.scrollTop =
        notificationsContainerRef.current.scrollHeight;
    }
  }, [notifications]);

// Function to format date and time from a Timestamp object
const formatDateTime = (timestamp) => {
  const formattedDateTime = timestamp.replace("T", " ").replace(/\[UTC\]/g, '').substring(0, 19);
  return formattedDateTime;
};

  return (
    <div>
      <div className="title">
        <h3>Notifications</h3>
        <div className="notification-list" ref={notificationsContainerRef}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification ${
                notification.readStatus ? "read" : "unread"
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="notification-content">
               
                <div className="notification-message">
                  <strong>Notification: </strong>
                  {notification.contentText}
                </div>
                <div className="notification-time">
                  <strong>@ </strong>{" "}
                  {formatDateTime(notification.creationTime)}
                </div>
                <div className="notification-icon">
                  {notification.readStatus ? <FaCheckDouble /> : <FaCheck />}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="back-button">
          <button id="back-button" onClick={() => navigate("/Home")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
