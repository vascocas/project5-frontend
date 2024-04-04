import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import ChangePasswordModal from "../components/users/ChangePasswordModal";
import { userStore } from "../stores/UserStore";
import { useNavigate, useParams } from "react-router-dom";
import "./Profile.css";
import "../index.css";

function Profile() {
  const { token, username } = userStore();
  const { usernameParam } = useParams();
  const [user, setUser] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const navigate = useNavigate();
  const [isLoggedUser, setIsLoggedUser] = useState(false);
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
            user,
            totalTasks,
            totalToDoTasks,
            totalDoingTasks,
            totalDoneTasks,
          } = responseData;

          // Update state with the extracted data
          setUser(user);
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

    // Check if the logged-in user is viewing their own profile
    setIsLoggedUser(username === usernameParam);

    // Call fetchUserProfile once when the component mounts
    fetchUserProfile();
  }, [token, usernameParam, username]);

  // Function to handle updating user profile
  const handleUpdateProfile = async () => {
    if (!user.email || !user.firstName || !user.lastName || !user.phone) {
      console.error("All fields are required");
      return;
    }
    try {
      const userData = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        photo: user.photo,
      };
      const requestBody = JSON.stringify(userData);
      const response = await fetch(
        `http://localhost:8080/project5-backend/rest/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: requestBody,
        }
      );
      if (response.ok) {
        // Display a success message
        console.log("Profile updated successfully!");
        navigate("/Home");
      } else {
        // Display an error message if request fails
        console.error("Failed to update user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleConfirmChangePassword = async (
    selectedUserId,
    actualPassword,
    newPassword,
    confirmNewPassword
  ) => {
    try {
      const userData = {
        id: selectedUserId,
        password: actualPassword,
        newPass: newPassword,
        confirmPass: confirmNewPassword,
      };
      const requestBody = JSON.stringify(userData);
      const response = await fetch(
        `http://localhost:8080/project5-backend/rest/users/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            token: token,
          },
          body: requestBody,
        }
      );
      if (response.ok) {
        // Password updated successfully
        alert("Password updated successfully!");
      } else {
        // Handle error
        alert("Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const handleOpenChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };

  if (!user) {
    return <div>Trouble while loading information...</div>;
  }

  return (
    <div className="userProfile">
      <Header />
      <Sidebar />
      <div className="contents">
      <div className="left-page-wrap"></div>
      <div className="profile-details">
        <h2>My Profile</h2>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" value={user.username} readOnly />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        />
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          value={user.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
        />
        <label htmlFor="photo">Photo</label>
        <input
          type="text"
          id="photo"
          value={user.photo}
          onChange={(e) => setUser({ ...user, photo: e.target.value })}
        />
        {isLoggedUser && (
          <React.Fragment>
            {" "}
            <button onClick={handleUpdateProfile}>Update Profile</button>
            <ChangePasswordModal
              isOpen={showChangePasswordModal}
              onRequestClose={() => setShowChangePasswordModal(false)}
              onSubmit={handleConfirmChangePassword}
              title="Change Password"
            />
            <button onClick={() => handleOpenChangePasswordModal(user.id)}>
              Change Password
            </button>{" "}
          </React.Fragment>
        )}
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
