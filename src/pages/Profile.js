import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/navbar/Sidebar";
import ChangePasswordModal from "../components/users/ChangePasswordModal";
import { userStore } from "../stores/UserStore";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import "../index.css";

function Profile() {
  const { token, username } = userStore();
  const [user, setUser] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/project4vc/rest/users/loggedUser`,
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
          setUser(data);
        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    // Call fetchUserProfile once when the component mounts
    fetchUserProfile();
  }, [token, username]);

  // Function to handle updating user profile
  const handleUpdateProfile = async () => {
    if (
      !user.email ||
      !user.firstName ||
      !user.lastName ||
      !user.phone
    ) {
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
        `http://localhost:8080/project4vc/rest/users/profile`,
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
        `http://localhost:8080/project4vc/rest/users/password`,
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
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={() => navigate("/Home")}>Back to Home</button>
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onRequestClose={() => setShowChangePasswordModal(false)}
          onSubmit={handleConfirmChangePassword}
          title="Change Password"
        />
        <button onClick={() => handleOpenChangePasswordModal(user.id)}>
          Change Password
        </button>
      </div>
      <div className="right-page-wrap"></div>
    </div>
  );
}

export default Profile;
