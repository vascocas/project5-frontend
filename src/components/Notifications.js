import React, { useState } from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";

const Notifications = ({ notifications }) => {
  const { token } = userStore();
  const [unreadCount, setUnreadCount] = useState(notifications.filter(notification => !notification.readStatus).length);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

// Function to handle marking all user notifications as read
const markAllAsRead = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5-backend/rest/notifications/read`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token, // Assuming you have token available here
          },
        }
      );
      
      if (response.ok) {
        // Update the unread count
        setUnreadCount(0);
      } else {
        console.error("Failed to mark notifications as read:", response.statusText);
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };
  

  const openModal = () => {
    setShowModal(true);
    markAllAsRead(); // Mark all notifications as read when opening the modal
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleNotificationClick = (notification) => {
    navigate(`/profile/${notification.senderId}`); // Navigate to sender's profile
  };

  return (
    <div>
      <div className="header">
        <button onClick={openModal}>{unreadCount} Unread</button>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="notification-list">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification ${notification.read ? "read" : ""}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-content">
                    <div>Time: {notification.creationTime}</div>
                    <div>Message: {notification.contentText}</div>
                    <button onClick={() => markAllAsRead(notification.id)}>
                      {notification.read ? <FaCheckDouble /> : <FaCheck />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
