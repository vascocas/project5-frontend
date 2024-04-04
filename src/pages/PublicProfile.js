import React, { useState, useEffect } from "react";
import { userStore } from "../stores/UserStore";
import { useNavigate, useParams } from "react-router-dom";
import "./PublicProfile.css";
import "../index.css";

function Profile() {
  const { token, username } = userStore();
  const { usernameParam } = useParams();
  const [user, setUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    photo: ""
  });
  const navigate = useNavigate();
  // Define task statistics variables in state
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalToDoTasks, setTotalToDoTasks] = useState(0);
  const [totalDoingTasks, setTotalDoingTasks] = useState(0);
  const [totalDoneTasks, setTotalDoneTasks] = useState(0);

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
          setUser({username,
            email,
            firstName,
            lastName,
            photo,
          });
          setTotalTasks(totalTasks);
          setTotalToDoTasks(totalToDoTasks);
          setTotalDoingTasks(totalDoingTasks);
          setTotalDoneTasks(totalDoneTasks);

        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    // Call fetchUserProfile once when the component mounts
    fetchUserProfile();
  }, [token, usernameParam, username]);

  return (
    <div className="userProfile">
      <div className="contents">
      <div className="left-page-wrap"></div>
      <div className="profile-details">
        <h2>My Profile</h2>
        <img className="user-photo" src={user.photo} alt="Profile" />
        <label htmlFor="username">Username</label>
        <input type="text" id="username" value={user.username} readOnly />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={user.email} readOnly />
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={user.firstName} readOnly />
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          value={user.lastName} readOnly />        
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

export default Profile;
