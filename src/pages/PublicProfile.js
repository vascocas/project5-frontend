import React, { useState, useEffect } from "react";
import { userStore } from "../stores/UserStore";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import "./PublicProfile.css";
import "../index.css";

function PublicProfile() {
  const { token, loggedId } = userStore();
  const { usernameParam } = useParams();
  const [user, setUser] = useState({
    userId: "",
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    photo: "",
  });
  const navigate = useNavigate();
  // Define task statistics variables in state
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalToDoTasks, setTotalToDoTasks] = useState(0);
  const [totalDoingTasks, setTotalDoingTasks] = useState(0);
  const [totalDoneTasks, setTotalDoneTasks] = useState(0);

  // State for messages
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);

  // State for composing new message
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/project5-backend/rest/users/profile/username/?username=${usernameParam}`,
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
          // Extract data from the response
          const {
            userId,
            username,
            email,
            firstName,
            lastName,
            photo,
            totalTasks,
            totalToDoTasks,
            totalDoingTasks,
            totalDoneTasks,
          } = responseData;

          // Update state with the extracted data
          setUser({ userId, username, email, firstName, lastName, photo });
          setTotalTasks(totalTasks);
          setTotalToDoTasks(totalToDoTasks);
          setTotalDoingTasks(totalDoingTasks);
          setTotalDoneTasks(totalDoneTasks);

          // Call fetchMessages with userId
          fetchReceivedMessages(user.userId);
          fetchSentMessages(user.userId);
        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token, usernameParam]);

  const fetchReceivedMessages = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5-backend/rest/messages/inboxChat/${userId}/${loggedId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      if (response.ok) {
        const messagesData = await response.json();
        setReceivedMessages(messagesData);
      } else {
        console.error("Failed to fetch messages:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchSentMessages = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5-backend/rest/messages/sentChat/${loggedId}/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      if (response.ok) {
        const messagesData = await response.json();
        setSentMessages(messagesData);
      } else {
        console.error("Failed to fetch messages:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Function to handle sending a new message
  const sendMessage = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/project5-backend/rest/messages/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            senderId: loggedId,
            receiverId: user.userId,
            messageText: newMessage,
          }),
        }
      );
      if (response.ok) {
        // Message sent successfully, fetch updated messages
        fetchReceivedMessages(user.userId);
        fetchSentMessages(user.userId);
        setNewMessage("");
      } else {
        console.error("Failed to send message:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Function to handle marking a message as read
  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/project5-backend/rest/messages/read/${messageId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      if (response.ok) {
        // Message marked as read successfully, fetch updated messages
        fetchReceivedMessages(user.userId);
        fetchSentMessages(user.userId);
      } else {
        console.error("Failed to mark message as read:", response.statusText);
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  return (
    <div className="userProfile">
      <div className="contents">
        <div className="left-page-wrap">
          <div className="messages-container">
            <h2>Messages</h2>
            <div className="messages-list">
              {/* Render received messages */}
              {receivedMessages.map((message) => (
                <div key={message.id} className="message received">
                  <div className="message-content">
                    {message.readStatus ? (
                      <button onClick={() => markAsRead(message.id)}>
                        <FaCheck />
                      </button>
                    ) : (
                      <FaCheckDouble />
                    )}{" "}
                    {message.messageText}
                  </div>
                </div>
              ))}
              {/* Render sent messages */}
              {sentMessages.map((message) => (
                <div key={message.id} className="message sent">
                  <div className="message-content">
                    {message.messageText}{" "}
                    {message.readStatus ? (
                      <button onClick={() => markAsRead(message.id)}>
                        <FaCheck />
                      </button>
                    ) : (
                      <FaCheckDouble />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="compose-message">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
        <div className="profile-details">
          <h2>My Profile</h2>
          <img className="user-photo" src={user.photo} alt="Profile" />
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={user.username} readOnly />
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={user.email} readOnly />
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" value={user.firstName} readOnly />
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" value={user.lastName} readOnly />
          <button onClick={() => navigate("/Home")}>Back to Home</button>
        </div>
        <div className="right-page-wrap">
          <div className="tasks-counter">
            <h3>Tasks Counter</h3>
            <div className="task-statistic">
              <span>Total Tasks:</span>
              <span>{totalTasks}</span>
            </div>
            <div className="task-statistic">
              <span>Total ToDo Tasks:</span>
              <span>{totalToDoTasks}</span>
            </div>
            <div className="task-statistic">
              <span>Total Doing Tasks:</span>
              <span>{totalDoingTasks}</span>
            </div>
            <div className="task-statistic">
              <span>Total Done Tasks:</span>
              <span>{totalDoneTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicProfile;
