import React, { useEffect, useRef } from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import { notificationStore } from "../stores/NotificationStore";
import "./Notifications.css";

const Notifications = () => {
  const { token } = userStore();
  const { notifications, setUnreadCount } = notificationStore();
  const navigate = useNavigate();

  // Ref for the notifications container
  const notificationsContainerRef = useRef(null);

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

  useEffect(() => {
    // Scroll to the bottom of the notifications container
    if (notificationsContainerRef.current) {
      notificationsContainerRef.current.scrollTop =
        notificationsContainerRef.current.scrollHeight;
    }
  }, [notifications]);

// Function to format date and time from a Timestamp object
/*const formatDateTime = (timestamp) => {
  const formattedDateTime = timestamp.replace("T", " ").replace(/\[UTC\]/g, '').substring(0, 19);
  return formattedDateTime;
};
*/
const formatDateTime = (timestamp) => {
  console.log("Notification creation time:", timestamp);

  if (typeof timestamp !== "number") {
    return ""; // Return empty string if timestamp is not a number
  }

  // Create a Date object from the timestamp in milliseconds
  const date = new Date(timestamp);

  // Format the date and time components
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if necessary
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if necessary
  const hours = String(date.getHours()).padStart(2, "0"); // Add leading zero if necessary
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Add leading zero if necessary
  const seconds = String(date.getSeconds()).padStart(2, "0"); // Add leading zero if necessary

  // Construct the formatted date and time string
  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

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
