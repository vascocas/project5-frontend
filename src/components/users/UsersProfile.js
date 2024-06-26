import React, { useState, useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import { baseURL } from "../../pages/Requests";
import { useNavigate } from "react-router-dom";
import "../../pages/UserManagement.css";
import "../../index.css";

function UsersProfile() {
  const navigate = useNavigate();
  const { token, usernames } = userStore();
  const { role } = userStore((state) => state);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    photo: "",
  });
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    const fetchOtherUserProfile = async () => {
      try {
        if (!selectedUserId) return;
        const response = await fetch(
          `${baseURL}users/user/?userId=${selectedUserId}`,
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
          setSelectedUser(data);
        } else {
          console.error("Failed to fetch user profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    // Call fetchUserProfile once when the component mounts
    fetchOtherUserProfile();
  }, [token, selectedUserId]);

  // Function to handle updating user profile
  const handleUpdateOthersProfile = async () => {
    // Check if any required fields are empty
    if (
      !selectedUser.email ||
      !selectedUser.firstName ||
      !selectedUser.lastName ||
      !selectedUser.phone
    ) {
      setMessage("All fields are required");
      return;
    }

    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(selectedUser.email)) {
      setMessage("Please enter valid email format");
      return;
    }

    // Phone number validation
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(selectedUser.phone)) {
      setMessage("Please enter only numeric characters for the phone number");
      return;
    }

    try {
      const userData = {
        id: selectedUser.id,
        email: selectedUser.email,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        phone: selectedUser.phone,
        photo: selectedUser.photo,
      };
      const requestBody = JSON.stringify(userData);
      const response = await fetch(`${baseURL}users/othersProfile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: requestBody,
      });
      if (response.ok) {
        // Display a success message
        alert("Profile updated successfully!");
        navigate("/Home");
      } else {
        // Display an error message if request fails
        console.error("Failed to update user profile:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSelect = (e) => {
    const selectedUserId = e.target.value;
    setSelectedUserId(selectedUserId);
  };

  const handleCancel = () => {
    setSelectedUser({
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      photo: "",
    });
    setSelectedUserId("");
  };

  if (!selectedUser) {
    return <div>Trouble while loading information...</div>;
  }

  return (
    <div>
      <div className="otherUserProfile">
        <div>
          <label htmlFor="user">Choose user:</label>
          <br />
          <select
            id="otherUserProfile"
            onChange={handleSelect}
            value={selectedUserId}
          >
            <option value="">Select Username</option>
            {usernames.map((username) => (
              <option key={username.id} value={username.id}>
                {username.username}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="profile-details">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={selectedUser.username}
          readOnly
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={selectedUser.email}
          onChange={(e) =>
            setSelectedUser({ ...selectedUser, email: e.target.value })
          }
        />
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          value={selectedUser.firstName}
          onChange={(e) =>
            setSelectedUser({ ...selectedUser, firstName: e.target.value })
          }
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          value={selectedUser.lastName}
          onChange={(e) =>
            setSelectedUser({ ...selectedUser, lastName: e.target.value })
          }
        />
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          value={selectedUser.phone}
          onChange={(e) =>
            setSelectedUser({ ...selectedUser, phone: e.target.value })
          }
        />
        <label htmlFor="photo">Photo</label>
        <input
          type="text"
          id="photo"
          value={selectedUser.photo}
          onChange={(e) =>
            setSelectedUser({ ...selectedUser, photo: e.target.value })
          }
        />
        <p id="warningMessage">{message}</p>{" "}
        {role === "PRODUCT_OWNER" && (
          <button id="otherUserButton" onClick={handleUpdateOthersProfile}>
            Update Profile
          </button>
        )}
        <button id="otherUserButton" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default UsersProfile;
