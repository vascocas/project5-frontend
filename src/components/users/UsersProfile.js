import React, { useState, useEffect } from "react";
import { userStore } from "../../stores/UserStore";
import { useNavigate } from "react-router-dom";
import "../../pages/Profile.css";
import "../../index.css";

function UsersProfile() {
  const navigate = useNavigate();
  const { token, usernames } = userStore();
  const { role } = userStore(state => state);
  const [selectedUser, setSelectedUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    photo: "",
  });
  const [selectedUsername, setSelectedUsername] = useState("");

  useEffect(() => {
    const fetchOtherUserProfile = async () => {
      try {
        if (!selectedUsername) return;
        const response = await fetch(
          `http://localhost:8080/project4vc/rest/users/username/?username=${selectedUsername}`,
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
  }, [token, selectedUsername]);

  // Function to handle updating user profile
  const handleUpdateOthersProfile = async () => {
    // Check if any required fields are empty
    if (
      !selectedUser.email ||
      !selectedUser.firstName ||
      !selectedUser.lastName ||
      !selectedUser.phone
    ) {
      console.error("All fields are required");
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
      const response = await fetch(
        `http://localhost:8080/project4vc/rest/users/othersProfile`,
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
    const selectedUsername = e.target.value;
    setSelectedUsername(selectedUsername);
  };

  const handleCancel = () => {
    setSelectedUser({
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      photo: ""
    });
    setSelectedUsername("");
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
          <select id="otherUserProfile" onChange={handleSelect} value={selectedUsername}>
            <option value="">Select Username</option>
            {usernames.map((username) => (
              <option key={username.id} value={username.username}>
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
        {(role === "PRODUCT_OWNER" && <button id="otherUserButton" onClick={handleUpdateOthersProfile}>Update Profile</button>)}
        <button id="otherUserButton" onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default UsersProfile;
