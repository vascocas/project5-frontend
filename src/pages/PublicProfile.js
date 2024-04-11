import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { userStore } from "../stores/UserStore";
import { websocketStore } from "../stores/WebSocketStore";
import WebSocketClient from "../components/websocket/WebSocketClient";
import MessageWebSocket from "../components/websocket/MessageWebSocket";
import { baseURL } from "./Requests";
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
  //const { chatMessages, setChatMessages, addMessage } = websocketStore();

  MessageWebSocket();

  // State for messages
 const [chatMessages, setChatMessages] = useState([]);

  // State for composing new message
  const [newMessage, setNewMessage] = useState("");

  // Ref for the messages container
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${baseURL}users/profile/username/?username=${usernameParam}`,
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
          fetchChatMessages(userId);
        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [token, usernameParam]);

  const fetchChatMessages = async (userId) => {
    try {
      const response = await fetch(
        `${baseURL}messages/chat/${userId}/${loggedId}`,
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
        setChatMessages(messagesData);
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
      // Check if newMessage is empty
      if (!newMessage.trim()) {
        console.error("Message cannot be empty.");
        return; // Exit function early if message is empty
      }
      // Creates MessageDto
      const requestBody = JSON.stringify({
        senderId: loggedId,
        receiverId: user.userId,
        messageText: newMessage,
      });
      const response = await fetch(
        `${baseURL}messages/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: requestBody,
        }
      );
      if (response.ok) {
        // Message sent successfully, fetch updated messages
        fetchChatMessages(user.userId);
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
        `${baseURL}messages/read/${messageId}`,
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
        fetchChatMessages(user.userId);
      } else {
        console.error("Failed to mark message as read:", response.statusText);
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the messages container
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Function to handle sending message when Enter key is pressed
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // <WebSocketClient
  // endpoint={`chat/${user.userId}/${loggedId}`}
  // onDataReceived={fetchChatMessages}
  // storeAction="addMessage"/>

  return (
    <div className="userProfile">
      <div className="contents">
        <div className="left-page-wrap">
          <div className="messages-container">
            <h3>Messages Chat</h3>
            <div className="messages-list" ref={messagesContainerRef}>
              {/* Render chat messages */}
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.senderId === loggedId ? "sent" : "received"
                  } ${message.readStatus ? "read" : ""}`}
                >
                  <div className="message-content">
                    {message.messageText}{" "}
                    <button onClick={() => markAsRead(message.id)}>
                      {message.readStatus ? <FaCheckDouble /> : <FaCheck />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="compose-message">
              <input
                type="text"
                id="send-message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <br></br>
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
